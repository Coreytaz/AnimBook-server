import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BannerEntity } from '../banner/entities/banner.entity';
import { CatergoriesEntity } from '../catergories/entities/catergories.entity';
import { DescriptionsProductEntity } from '../descriptions-product/entities/descriptions-product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderItemEntity } from '../order/entities/orderItem.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PublisherEntity } from '../publisher/entities/publisher.entity';
import { RatingEntity } from '../rating/entities/rating.entity';
import { UserEntity } from '../users/entities/user.entity';

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
