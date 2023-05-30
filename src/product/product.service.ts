import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { GenerateSlugService } from 'src/generate-slug/generate-slug.service';
import { CreateProductDto } from './dto/create-product.dto';
import { randomInt } from 'crypto';
import { CatergoriesService } from 'src/catergories/catergories.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { ConfigService } from '@nestjs/config';
import { QueryFilterRating, QueryProduct, SortEnum } from './types';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private catergoriesService: CatergoriesService,
    private readonly generateSlug: GenerateSlugService,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async findByName(search: string): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        name: Like(`%${search}%`),
      },
      take: 5,
    });
  }

  async getProducts(slug: string, query: QueryProduct) {
    const limit = query.limit || 6;
    const page = query.page || 1;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder
      .leftJoin('product.category', 'category')
      .where('category.slug = :slug', { slug })
      .leftJoinAndSelect('product.rating', 'rating')
      .select(['product', 'rating.rating']);

    if (query.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    switch (query.sort) {
      case SortEnum.LowerPrice:
        queryBuilder.addOrderBy('product.price', 'ASC');
        break;
      case SortEnum.TowerPrice:
        queryBuilder.addOrderBy('product.price', 'DESC');
        break;
      case SortEnum.Rating:
        queryBuilder.addOrderBy('rating.rating', 'ASC');
        break;
      default:
        queryBuilder.addOrderBy('product.price', 'ASC');
        break;
    }

    return paginate<ProductEntity>(queryBuilder, {
      ...query,
      limit,
      page,
      route: `${this.configService.get('API_FRONT')}${slug}`,
    });
  }

  async getRatingProduct(slug: string, query: QueryFilterRating) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.slug = :slug', { slug })
      .leftJoinAndSelect('product.rating', 'rating')
      .leftJoinAndMapOne('rating.user', 'rating.user', 'user')
      .getOne();

    const filtersCounts = this.countDigits(
      product.rating.map((item) => item.rating),
    );

    const totalRating =
      product.rating?.reduce((acc, cur) => acc + cur.rating, 0) /
        product.rating?.length || 0;
    const countReviews = product.rating.length || 0;

    if (query.filter) {
      return {
        rating: product.rating.filter((item) =>
          query.filter.includes(String(item.rating)),
        ),
        totalRating,
        countReviews,
        filtersCounts,
      };
    }

    return {
      rating: product.rating,
      totalRating,
      countReviews,
      filtersCounts,
    };
  }

  async getDescriptionProduct(slug: string) {
    const { descriptions } = await this.productRepository.findOne({
      where: { slug },
      relations: ['descriptions'],
    });

    return { descriptionList: descriptions };
  }

  async save(product: ProductEntity): Promise<void> {
    this.productRepository.save(product);
  }

  async createUniqueSlug(text: string): Promise<string> {
    let slug = this.generateSlug.transliterateText(text);
    let existingSlug = await this.productRepository.findOne({
      where: { slug },
    });

    while (existingSlug) {
      slug = slug + randomInt(10000);
      existingSlug = await this.productRepository.findOne({
        where: { slug },
      });
    }

    return slug;
  }

  async createProduct(
    dto: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<ProductEntity> {
    const { name } = dto;
    const slug = await this.createUniqueSlug(name);
    const isLastSubCategories =
      await this.catergoriesService.isLastSubCategories(dto.categoryId);
    if (!isLastSubCategories) {
      throw new BadRequestException(
        'Невозможно создать новый продукт в не последний категории товаров',
        'Неверный запрос',
      );
    }

    const category = await this.catergoriesService.findBy({
      where: { _id: dto.categoryId },
    });

    const { url: img } = await this.cloudinary.upload(file, 'product');
    const product = this.productRepository.create({
      name: dto.name,
      discription: dto.description,
      img: [
        {
          src: img,
          alt: slug,
        },
      ],
      price: dto.price,
      slug,
      category,
    });
    await this.catergoriesService.save(category);
    return this.productRepository.save(product);
  }

  async findOne(
    options: FindOneOptions<ProductEntity>,
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ ...options });

    if (!product) {
      throw new BadRequestException(
        'Не удалось найти продукт',
        'Неверный запрос',
      );
    }

    return product;
  }

  async findArray(productsId: string[]): Promise<ProductEntity[]> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .whereInIds(productsId)
      .getMany();

    if (!product) {
      throw new BadRequestException(
        'Не удалось найти продукт',
        'Неверный запрос',
      );
    }

    return product;
  }

  paginateResponse(data, page, limit) {
    const [result, total] = data;
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      statusCode: 'success',
      data: [...result],
      count: total,
      currentPage: page,
      nextPage: nextPage,
      prevPage: prevPage,
      lastPage: lastPage,
    };
  }

  countDigits(number: number[]): {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  } {
    const digitMap = new Map();

    for (let i = 0; i < number.length; i++) {
      const digit = number[i];

      if (digitMap.has(digit)) {
        digitMap.set(digit, digitMap.get(digit) + 1);
      } else {
        digitMap.set(digit, 1);
      }
    }

    return Object.fromEntries(digitMap);
  }
}
