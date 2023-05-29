import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    example: 'qwe',
  })
  slug: string;
  @ApiProperty({
    example:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, nam! Perferendis accusantium possimus aliquam? Possimus, exercitationem quisquam numquam earum magni est pariatur alias unde tempora, facilis maxime hic, placeat dolorem!',
  })
  discription: string;

  @ApiProperty({
    example: 4,
  })
  rating: number;

  @ApiProperty({
    example: '24b8c31e-db83-4cc5-a769-e75ab540b4c4',
  })
  userId: string;
}
