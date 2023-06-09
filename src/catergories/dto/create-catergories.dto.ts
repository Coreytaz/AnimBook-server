import { ApiProperty } from '@nestjs/swagger';

export class CreateCatergoriesDto {
  @ApiProperty({ example: 'Фигурки' })
  readonly name: string;

  @ApiProperty({ example: 'Описание категории 1', required: false })
  readonly description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly img: Express.Multer.File;
}

export class CreateSubcategoriesDto {
  @ApiProperty({ example: 'e480b6e3-ce0c-43c6-84cf-33b2dcf7c282' })
  readonly _id: string;

  @ApiProperty({ example: 'Акриловые фигурки' })
  readonly name: string;

  @ApiProperty({ example: 'Описание категории 1', required: false })
  readonly description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly img: Express.Multer.File;
}
