import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ where: { email } });

    if (user) {
      if (await compare(password, user.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async register(dto: CreateUserDto): Promise<any> {
    const existingByEmail = await this.userService.findOne({
      where: { email: dto.email },
    });
    if (existingByEmail) {
      throw new BadRequestException(
        'Пользователь с таким E-mail есть в системе',
        'Неверный запрос',
      );
    }
    const existingByPhone = await this.userService.findOne({
      where: { phone: dto.phone },
    });
    if (existingByPhone) {
      throw new BadRequestException(
        'Пользователь с таким Телефоном есть в системе',
        'Неверный запрос',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = await this.userService.create(dto);

    return {
      ...userData,
      token: this.jwtService.sign({ id: userData.id }),
    };
  }

  async login(user: UserEntity) {
    return {
      ...user,
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
