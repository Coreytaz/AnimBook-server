import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CatergoriesModule } from 'src/catergories/catergories.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [CatergoriesModule, ProductModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
