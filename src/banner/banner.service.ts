import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async findAll() {
    const banner = await this.bannerRepository.find();
    console.log(banner);
    return banner.map((item) => {
      return {
        ...item,
        url: `${this.configService.get('API_FRONT')}${item.url}`,
      };
    });
  }

  async create(dto: CreateBannerDto, file: Express.Multer.File) {
    const { url: img } = await this.cloudinary.upload(file, 'banner');
    const banner = this.bannerRepository.create({
      img,
      url: dto.url,
      caption: dto.caption,
    });

    return this.bannerRepository.save(banner);
  }
}
