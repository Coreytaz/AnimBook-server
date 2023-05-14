import { ApiProperty } from '@nestjs/swagger';

export class PatchUserRequest {
  @ApiProperty({ example: 'ленина 1а' })
  address: string;

  @ApiProperty({ example: '123123' })
  username: string;
}
