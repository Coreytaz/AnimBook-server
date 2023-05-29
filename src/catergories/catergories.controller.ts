import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CatergoriesService } from './catergories.service';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateCatergoriesDto,
  CreateSubcategoriesDto,
} from './dto/create-catergories.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Сatergories')
@Controller('catergories')
export class CatergoriesController {
  constructor(private readonly catergoriesService: CatergoriesService) {}

  @Get('All')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.catergoriesService.findAll();
  }

  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async findPopular() {
    return this.catergoriesService.findPopular();
  }

  @Get('Sub/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    example: 'figurki',
    required: true,
    name: 'slug',
  })
  async findSub(@Param('slug') slug: string) {
    return this.catergoriesService.findSub(slug);
  }

  @Get('filters/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    example: 'akrilovye-figurki',
    required: true,
    name: 'slug',
  })
  async getFilters(@Param('slug') slug: string) {
    return this.catergoriesService.getFilter(slug);
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCatergoriesDto })
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateCatergoriesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.catergoriesService.createCategory(dto, file);
  }

  @Post('/createSub')
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateSubcategoriesDto })
  @HttpCode(HttpStatus.OK)
  async createSub(
    @Body() dto: CreateSubcategoriesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { _id } = dto;
    return this.catergoriesService.createSubCategory(dto, _id, file);
  }
}
