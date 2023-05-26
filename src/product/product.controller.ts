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
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.createProduct(dto, file);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
    example:
      'figurka-neca-teenage-mutant-ninja-turtles---michelangelo-1990-movie',
  })
  async findOne(@Param('slug') slug: string) {
    return this.productService.findOne({ where: { slug } });
  }

  @Get('Descriptions-product/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
    example:
      'figurka-neca-teenage-mutant-ninja-turtles---michelangelo-1990-movie',
  })
  async getDescriptionProduct(@Param('slug') slug: string) {
    return this.productService.getDescriptionProduct(slug);
  }

  @Get('rating/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
    example:
      'figurka-neca-teenage-mutant-ninja-turtles---michelangelo-1990-movie',
  })
  async getRatingProduct(@Param('slug') slug: string) {
    return this.productService.getRatingProduct(slug);
  }
}
