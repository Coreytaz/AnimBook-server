import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './entities/banner.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerEntity]),
    CloudinaryModule,
    ConfigModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
