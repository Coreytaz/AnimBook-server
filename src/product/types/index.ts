import { ApiProperty } from '@nestjs/swagger';

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
  readonly limit: number;

  @ApiProperty({
    example: 1,
  })
  readonly page: number;
}
