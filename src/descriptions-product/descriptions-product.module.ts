import { Module } from '@nestjs/common';
import { DescriptionsProductController } from './descriptions-product.controller';
import { DescriptionsProductService } from './descriptions-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DescriptionsProductEntity } from './entities/descriptions-product.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DescriptionsProductEntity]),
    ProductModule,
  ],
  controllers: [DescriptionsProductController],
  providers: [DescriptionsProductService],
  exports: [DescriptionsProductService],
})
export class DescriptionsProductModule {}
