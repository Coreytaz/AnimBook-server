import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({
    example: 'qwe',
    required: false,
  })
  url: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly img: Express.Multer.File;

  @ApiProperty({
    example: 'qweqweqwe',
    required: false,
  })
  caption: string;
}
