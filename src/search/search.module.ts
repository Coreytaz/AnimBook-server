import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { CatergoriesModule } from '../catergories/catergories.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [CatergoriesModule, ProductModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
