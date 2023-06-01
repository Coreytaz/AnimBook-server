import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateBannerDto })
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bannerService.create(dto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.bannerService.findAll();
  }
}
