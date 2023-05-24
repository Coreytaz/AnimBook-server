import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example:
      'Фигурка NECA Teenage Mutant Ninja Turtles - Michelangelo (1990 Movie)',
  })
  readonly name: string;

  @ApiProperty({
    example:
      'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов.',
  })
  readonly description: string;

  @ApiProperty({
    example:
      'https://static.insales-cdn.com/images/products/1/1945/398264217/large_Figurka-Mikelandzhelo-_-Neca-Teenage-Mutant-Ninja-Turtles-Michelangelo.png',
  })
  readonly img: string;

  @ApiProperty({ example: 499 })
  readonly price: number;

  @ApiProperty({ example: '37b4c897-db65-46e3-a287-e284345c6d9e' })
  readonly categoryId: string;
}
