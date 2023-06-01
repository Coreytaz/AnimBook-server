import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<void> {
    this.repository.save(user);
  }

  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    const user = this.repository.findOne({ ...options });

    if (!user) {
      throw new BadRequestException(
        'Не удалось найти пользователя',
        'Неверный запрос',
      );
    }

    return user;
  }

  async update(userId: string, dto: UpdateUserDto) {
    const result = await this.repository.update({ id: userId }, dto);

    if (result.affected === 0) {
      throw new BadRequestException(
        'Не удалось найти пользователя',
        'Неверный запрос',
      );
    }
    const updatedUser = await this.findOne({ where: { id: userId } });
    return updatedUser;
  }

  async create(dto: CreateUserDto) {
    const salt = await genSalt(10);

    const newUser = this.repository.create({
      email: dto.email,
      username: dto.username,
      password: await hash(dto.password, salt),
      phone: dto.phone,
      address: dto.address,
    });

    return this.repository.save(newUser);
  }
}
