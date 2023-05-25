import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Any, Repository } from 'typeorm';
import { GenerateSlugService } from 'src/generate-slug/generate-slug.service';
import { CreateProductDto } from './dto/create-product.dto';
import { randomInt } from 'crypto';
import { CatergoriesService } from 'src/catergories/catergories.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private catergoriesService: CatergoriesService,
    private readonly generateSlug: GenerateSlugService,
  ) {}

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

  async createProduct(dto: CreateProductDto): Promise<ProductEntity> {
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

    const product = this.productRepository.create({
      name: dto.name,
      discription: dto.description,
      img: dto.img,
      price: dto.price,
      slug,
      category,
    });
    await this.catergoriesService.save(category);
    return this.productRepository.save(product);
  }

  async findOne(filter: {
    where: { _id?: string; slug?: string };
  }): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ ...filter });

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
}
