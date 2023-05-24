import { ApiProperty } from '@nestjs/swagger';

export class ParamsProduct {
  @ApiProperty({
    example: 'figurki',
    required: true,
  })
  readonly slug: string;
}
