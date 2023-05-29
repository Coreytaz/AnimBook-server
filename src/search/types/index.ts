import { ApiProperty } from '@nestjs/swagger';

export class QuerySearch {
  @ApiProperty({
    example: 'А',
  })
  readonly q: string;
}
