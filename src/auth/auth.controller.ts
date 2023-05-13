import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginUserRequest } from './types';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserRequest })
  async login(@Request() req) {
    return this.authService.login(req.user as UserEntity);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get('/refresh')
  async refresh(@Req() req) {
    return this.authService.login(req.user as UserEntity);
  }
}
