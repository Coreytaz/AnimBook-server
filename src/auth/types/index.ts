import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'ivan@gmail.com' })
  email: string;

  @ApiProperty({ example: 'ivan123' })
  password: string;
}
