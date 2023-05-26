import { Injectable } from '@nestjs/common';
import { DescriptionsProductDto } from './dto/create-descriptions-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { DescriptionsProductEntity } from './entities/descriptions-product.entity';

@Injectable()
export class DescriptionsProductService {
  constructor(
    @InjectRepository(DescriptionsProductEntity)
    private readonly descriptionsProductRepository: Repository<DescriptionsProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async createAutoFilterToDescritionProductArray(
    productId: string[],
    dto: DescriptionsProductDto,
  ) {
    const newDto = [dto];
    productId.map(async (id) => await this.createDescriptions(id, newDto));
  }
  async createAutoFilterToDescritionProductString(
    productId: string,
    dto: DescriptionsProductDto,
  ) {
    const newDto = [dto];
    await this.createDescriptions(productId, newDto);
  }

  async createDescriptions(
    productId: string,
    dto: DescriptionsProductDto[],
  ): Promise<DescriptionsProductEntity[]> {
    const product = await this.productService.findOne({
      where: { _id: productId },
    });

    const descriptionsProduct = dto.map((desc) =>
      this.descriptionsProductRepository.create({
        ...desc,
        product,
      }),
    );

    return this.descriptionsProductRepository.save(descriptionsProduct);
  }
}
