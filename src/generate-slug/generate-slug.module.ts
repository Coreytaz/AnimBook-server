import { Module } from '@nestjs/common';
import { GenerateSlugService } from './generate-slug.service';

@Module({
  providers: [GenerateSlugService],
  exports: [GenerateSlugService],
})
export class GenerateSlugModule {}
