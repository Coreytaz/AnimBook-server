import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'ivan123' })
  readonly password: string;

  @ApiProperty({ example: 'ivan@gmail.com' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: '899999999' })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ example: 'улица Пушкина' })
  readonly address: string;
  login: any;
}
