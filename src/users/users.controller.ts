import {
  Controller,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PatchUserRequest } from './types';
import { Request } from 'express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: PatchUserRequest })
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user?.id ? String(req.user.id) : null;
    return this.usersService.update(id, updateUserDto);
  }
}
