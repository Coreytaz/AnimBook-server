import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherEntity } from './entities/publisher.entity';
import { CatergoriesModule } from 'src/catergories/catergories.module';
import { ProductModule } from 'src/product/product.module';
import { GenerateSlugModule } from 'src/generate-slug/generate-slug.module';
import { DescriptionsProductModule } from 'src/descriptions-product/descriptions-product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublisherEntity]),
    CatergoriesModule,
    ProductModule,
    GenerateSlugModule,
    DescriptionsProductModule,
  ],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}
