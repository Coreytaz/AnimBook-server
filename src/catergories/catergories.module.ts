import { Module } from '@nestjs/common';
import { CatergoriesController } from './catergories.controller';
import { CatergoriesService } from './catergories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatergoriesEntity } from './entities/catergories.entity';
import { GenerateSlugModule } from 'src/generate-slug/generate-slug.module';

@Module({
  imports: [TypeOrmModule.forFeature([CatergoriesEntity]), GenerateSlugModule],
  controllers: [CatergoriesController],
  providers: [CatergoriesService],
  exports: [CatergoriesService],
})
export class CatergoriesModule {}
