import { ApiProperty } from '@nestjs/swagger';

export class DescriptionsProductDto {
  @ApiProperty({
    example: 'Издатель',
  })
  readonly name: string;

  @ApiProperty({
    example: 'АКС',
  })
  readonly description: string;

  @ApiProperty({
    example: 'Контора где издают книги)',
  })
  readonly descriptionHelp?: string;
}
