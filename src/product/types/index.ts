import { ApiProperty } from '@nestjs/swagger';

export enum SortEnum {
  LowerPrice = '-price',
  TowerPrice = 'price',
  Rating = 'rating',
}
export class ParamsProduct {
  @ApiProperty({
    example: 'figurki',
    required: true,
  })
  readonly slug: string;
}

export class BodyProduct {
  @ApiProperty({
    example: ['29645fd2-25ee-4941-ab39-bd1e1661ffe1'],
    required: true,
  })
  readonly productsId: string[];
}

export class QueryProduct {
  @ApiProperty({
    example: 10,
  })
  readonly limit: string;

  @ApiProperty({
    example: 1,
  })
  readonly page: string;

  @ApiProperty({
    example: 340,
  })
  readonly minPrice: string;

  @ApiProperty({
    example: 1000,
  })
  readonly maxPrice: string;

  @ApiProperty({
    enum: SortEnum,
  })
  readonly sort: SortEnum;
}

export class QueryFilterRating {
  @ApiProperty({
    example: ['1', '2'],
  })
  readonly filter: string[];
}
