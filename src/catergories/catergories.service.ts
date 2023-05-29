import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  FindOperator,
  IsNull,
  Like,
  Repository,
} from 'typeorm';
import { CatergoriesEntity } from './entities/catergories.entity';
import {
  CreateCatergoriesDto,
  CreateSubcategoriesDto,
} from './dto/create-catergories.dto';
import { GenerateSlugService } from 'src/generate-slug/generate-slug.service';
import { randomInt } from 'crypto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CatergoriesService {
  constructor(
    @InjectRepository(CatergoriesEntity)
    private readonly categoryRepository: Repository<CatergoriesEntity>,
    private readonly generateSlug: GenerateSlugService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async save(category: CatergoriesEntity): Promise<void> {
    this.categoryRepository.save(category);
  }

  async findByName(search: string): Promise<CatergoriesEntity[]> {
    return await this.categoryRepository.find({
      where: {
        name: Like(`%${search}%`),
      },
      take: 5,
    });
  }

  async findBy(
    options: FindOneOptions<CatergoriesEntity>,
  ): Promise<CatergoriesEntity> {
    return await this.categoryRepository.findOne({ ...options });
  }

  async findAll(): Promise<CatergoriesEntity[]> {
    return await this.categoryRepository
      .find({
        where: { parentCategory: IsNull() },
        relations: ['subcategories', 'products'],
      })
      .then((item) =>
        item.filter(
          (item) => item.subcategories.length > 0 || item.products.length > 0,
        ),
      )
      .then((item) =>
        item.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { subcategories, products, ...rest } = item;
          return rest as CatergoriesEntity;
        }),
      );
  }

  async findPopular() {
    return await this.categoryRepository
      .find({
        where: { parentCategory: IsNull() },
        relations: ['subcategories', 'products'],
        take: 4,
        order: {
          name: 'DESC',
        },
      })
      .then((item) =>
        item.filter(
          (item) => item.subcategories.length > 0 || item.products.length > 0,
        ),
      )
      .then((item) =>
        item.map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { subcategories, products, ...rest } = item;
          return rest as CatergoriesEntity;
        }),
      );
  }

  async findSub(slug: string) {
    const { name, subcategories } = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['subcategories', 'products'],
    });

    return {
      categoryName: name || '',
      subcategories,
    };
  }

  async getFilter(slug: string): Promise<any> {
    const { products, publisher } = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['products', 'publisher'],
    });
    const allPrice = products.map((item) => item.price);
    const lowPriceAndMax = {
      min: Math.min(...allPrice),
      max: Math.max(...allPrice),
    };

    return {
      publisher,
      lowPriceAndMax,
    };
  }

  async isLastSubCategories(_id: string): Promise<boolean> {
    const isLast = await this.categoryRepository.findOne({
      where: { _id },
      relations: ['subcategories'],
    });
    if (!isLast) {
      throw new BadRequestException(
        'Не удалось найти категорию',
        'Неверный запрос',
      );
    }
    if (isLast.subcategories.length > 0) {
      return false;
    }
    return true;
  }

  async createUniqueSlug(text: string): Promise<string> {
    let slug = this.generateSlug.transliterateText(text);
    let existingSlug = await this.categoryRepository.findOne({
      where: { slug },
    });

    while (existingSlug) {
      slug = slug + randomInt(10000);
      existingSlug = await this.categoryRepository.findOne({
        where: { slug },
      });
    }

    return slug;
  }

  async createCategory(
    dto: CreateCatergoriesDto,
    file: Express.Multer.File,
  ): Promise<CatergoriesEntity> {
    const { name } = dto;
    const slug = await this.createUniqueSlug(name);
    const { url: img } = await this.cloudinary.upload(file, 'category');
    const category = this.categoryRepository.create({
      name: dto.name,
      description: dto.description,
      img,
      slug,
    });

    return this.categoryRepository.save(category);
  }

  async createSubCategory(
    dto: CreateSubcategoriesDto,
    _id: string | FindOperator<string>,
    file: Express.Multer.File,
  ): Promise<CatergoriesEntity> {
    const category = await this.categoryRepository.findOneBy({ _id });

    if (!category) {
      throw new BadRequestException(
        'Не удалось найти категорию',
        'Неверный запрос',
      );
    }
    const { name } = dto;
    const slug = await this.createUniqueSlug(name);
    const { url: img } = await this.cloudinary.upload(file, 'subCategory');
    const subcategories = this.categoryRepository.create({
      name: dto.name,
      description: dto.description,
      img,
      slug,
    });
    subcategories.parentCategory = category;
    this.categoryRepository.save(category);
    return this.categoryRepository.save(subcategories);
  }
}
