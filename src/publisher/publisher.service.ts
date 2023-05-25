import { BadRequestException, Injectable } from '@nestjs/common';
import { PublisherProductDto } from './dto/create-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { PublisherEntity } from './entities/publisher.entity';
import { ProductService } from 'src/product/product.service';
import { CatergoriesService } from 'src/catergories/catergories.service';
import { GenerateSlugService } from 'src/generate-slug/generate-slug.service';
import { randomInt } from 'crypto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(PublisherEntity)
    private readonly publisherRepository: Repository<PublisherEntity>,
    private readonly generateSlug: GenerateSlugService,
    private readonly productService: ProductService,
    private readonly catergoriesService: CatergoriesService,
  ) {}

  async createUniqueSlug(text: string): Promise<string> {
    let slug = this.generateSlug.transliterateText(text);
    let existingSlug = await this.publisherRepository.findOne({
      where: { slug },
    });

    while (existingSlug) {
      slug = slug + randomInt(10000);
      existingSlug = await this.publisherRepository.findOne({
        where: { slug },
      });
    }

    return slug;
  }

  async createPublisher(categoryId: string, dto: PublisherProductDto) {
    const isLastSubCategories =
      await this.catergoriesService.isLastSubCategories(categoryId);
    if (!isLastSubCategories) {
      throw new BadRequestException(
        'Невозможно создать в не последний категории товаров',
        'Неверный запрос',
      );
    }

    const products = await this.productService.findArray(dto.productsId);
    const category = await this.catergoriesService.findBy({
      where: {
        _id: categoryId,
        products: { _id: Any(products.map((i) => i._id)) },
      },
    });

    if (!category) {
      throw new BadRequestException(
        'В такой категории нету таких товаров',
        'Неверный запрос',
      );
    }

    const publisher = this.publisherRepository.create({
      name: dto.name,
      city: dto.city,
      category,
      products,
      slug: await this.createUniqueSlug(dto.name),
    });

    return this.publisherRepository.save(publisher);
  }
}
