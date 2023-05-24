import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
  })
  async findOne(@Param('slug') slug: string) {
    return this.productService.findOne({ where: { slug } });
  }
}
