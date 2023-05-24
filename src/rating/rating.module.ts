import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatingEntity]),
    UsersModule,
    ProductModule,
  ],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
