import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerateSlugModule } from 'src/generate-slug/generate-slug.module';
import { ProductEntity } from './entities/product.entity';
import { CatergoriesModule } from 'src/catergories/catergories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    GenerateSlugModule,
    CatergoriesModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
