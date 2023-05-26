import { Module } from '@nestjs/common';
import { CatergoriesController } from './catergories.controller';
import { CatergoriesService } from './catergories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatergoriesEntity } from './entities/catergories.entity';
import { GenerateSlugModule } from 'src/generate-slug/generate-slug.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatergoriesEntity]),
    GenerateSlugModule,
    CloudinaryModule,
  ],
  controllers: [CatergoriesController],
  providers: [CatergoriesService],
  exports: [CatergoriesService],
})
export class CatergoriesModule {}
