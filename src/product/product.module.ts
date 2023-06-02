import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerateSlugModule } from '../generate-slug/generate-slug.module';
import { ProductEntity } from './entities/product.entity';
import { CatergoriesModule } from '../catergories/catergories.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    GenerateSlugModule,
    CatergoriesModule,
    CloudinaryModule,
    ConfigModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
