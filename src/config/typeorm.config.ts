import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BannerEntity } from 'src/banner/entities/banner.entity';
import { CatergoriesEntity } from 'src/catergories/entities/catergories.entity';
import { DescriptionsProductEntity } from 'src/descriptions-product/entities/descriptions-product.entity';
import { OrderEntity } from 'src/order/entities/order.entity';
import { OrderItemEntity } from 'src/order/entities/orderItem.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { PublisherEntity } from 'src/publisher/entities/publisher.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export const getTypeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATEBASE'),
  synchronize: true,
  entities: [
    UserEntity,
    CatergoriesEntity,
    ProductEntity,
    RatingEntity,
    PublisherEntity,
    DescriptionsProductEntity,
    OrderItemEntity,
    OrderEntity,
    BannerEntity,
  ],
});
