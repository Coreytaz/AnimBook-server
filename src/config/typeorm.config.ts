import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CatergoriesEntity } from 'src/catergories/entities/catergories.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export const getTypeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('DB-HOST'),
  port: configService.get('DB-PORT'),
  username: configService.get('DB-USERNAME'),
  password: configService.get('DB-PASSWORD'),
  database: configService.get('DB-DATEBASE'),
  synchronize: true,
  entities: [UserEntity, CatergoriesEntity, ProductEntity, RatingEntity],
});
