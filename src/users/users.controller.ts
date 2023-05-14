import {
  Controller,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PatchUserRequest } from './types';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('/me')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: PatchUserRequest })
  @UseGuards(JwtAuthGuard)
  update(@UserId() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
