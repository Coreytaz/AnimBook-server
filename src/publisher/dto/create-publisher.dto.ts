import { ApiProperty } from '@nestjs/swagger';

export class PublisherProductDto {
  @ApiProperty({
    example: 'АСТ',
  })
  readonly name: string;

  @ApiProperty({
    example: 'Москва',
  })
  readonly city: string;

  @ApiProperty({
    example: [
      '24b8c31e-db83-4cc5-a769-e75ab540b4c4',
      '2ea0577d-ab4f-4139-a7d6-9afabdbc1fbb',
    ],
  })
  readonly productsId: string[];
}
