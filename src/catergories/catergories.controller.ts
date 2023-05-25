import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CatergoriesService } from './catergories.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateCatergoriesDto,
  CreateSubcategoriesDto,
} from './dto/create-catergories.dto';

@ApiTags('Сatergories')
@Controller('catergories')
export class CatergoriesController {
  constructor(private readonly CatergoriesService: CatergoriesService) {}

  @Get('All')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.CatergoriesService.findAll();
  }

  @Get('Sub/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    example: 'figurki',
    required: true,
    name: 'slug',
  })
  async findSub(@Param('slug') slug: string) {
    return this.CatergoriesService.findSub(slug);
  }

  @Get('filters/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    example: 'akrilovye-figurki',
    required: true,
    name: 'slug',
  })
  async getFilters(@Param('slug') slug: string) {
    return this.CatergoriesService.getFilter(slug);
  }

  @Post('/create')
  @ApiBody({ type: CreateCatergoriesDto })
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateCatergoriesDto) {
    return this.CatergoriesService.createCategory(dto);
  }

  @Post('/createSub')
  @ApiBody({ type: CreateSubcategoriesDto })
  @HttpCode(HttpStatus.OK)
  async createSub(@Body() dto: CreateSubcategoriesDto) {
    const { _id } = dto;
    return this.CatergoriesService.createSubCategory(dto, _id);
  }
}
