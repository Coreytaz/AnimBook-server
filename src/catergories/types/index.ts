import { ApiProperty } from '@nestjs/swagger';

export class ParamsSubcategories {
  @ApiProperty({
    example: 'figurki',
    required: true,
    name: 'slug',
  })
  readonly slug: string;
}
