import { Injectable } from '@nestjs/common';
import { CatergoriesService } from 'src/catergories/catergories.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class SearchService {
  constructor(
    private catergoriesService: CatergoriesService,
    private productService: ProductService,
  ) {}

  async search(q: string) {
    const category = (await this.catergoriesService.findByName(q)).map(
      (item) => {
        return {
          value: `catalog/${item.slug}`,
          label: item.name,
        };
      },
    );
    const products = (await this.productService.findByName(q)).map((item) => {
      return {
        value: `product/${item.slug}`,
        label: item.name,
      };
    });

    return [
      {
        label: 'Каталог',
        options: category,
      },
      {
        label: 'Товары',
        options: products,
      },
    ];
  }
}
