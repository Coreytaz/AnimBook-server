import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeormConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CatergoriesModule } from './catergories/catergories.module';
import { GenerateSlugModule } from './generate-slug/generate-slug.module';
import { ProductModule } from './product/product.module';
import { RatingModule } from './rating/rating.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeormConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    CatergoriesModule,
    GenerateSlugModule,
    ProductModule,
    RatingModule,
    PublisherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
