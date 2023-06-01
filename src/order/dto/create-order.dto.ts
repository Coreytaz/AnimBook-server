import { ApiProperty } from '@nestjs/swagger';

export interface Products {
  productId: string;
  count: number;
}

export class CreateOrderWithUserDto {
  @ApiProperty({
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  readonly userId: string;

  @ApiProperty({
    example: [{ productId: 'b9269a8b-8437-4c25-987f-b486abf0ecc0', count: 3 }],
  })
  readonly products: Products[];

  @ApiProperty({
    example: '620123',
  })
  readonly postIndex: string;

  @ApiProperty({
    example: 'Екатеринбург 8марта',
  })
  readonly address: string;

  @ApiProperty({
    example: '11',
  })
  readonly apartaments: string;

  @ApiProperty({
    example: 100,
  })
  readonly amount: number;
}
