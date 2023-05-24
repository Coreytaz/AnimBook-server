import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<void> {
    this.repository.save(user);
  }

  findOne(filter: {
    where: { id?: string; username?: string; email?: string; phone?: string };
  }): Promise<UserEntity> {
    const user = this.repository.findOne({ ...filter });

    if (!user) {
      throw new BadRequestException(
        'Не удалось найти пользователя',
        'Неверный запрос',
      );
    }

    return user;
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(id, updateUserDto);
    await this.repository.save({
      id,
      ...updateUserDto,
    });
  }
}
