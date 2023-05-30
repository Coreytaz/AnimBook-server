import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BodyProduct, QueryFilterRating, QueryProduct } from './types';

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

  @Get('getProducts/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
    example:
      'figurka-neca-teenage-mutant-ninja-turtles---michelangelo-1990-movie',
  })
  async getProduct(@Param('slug') slug: string, @Query() query: QueryProduct) {
    return this.productService.getProducts(slug, query);
  }
  @Get('slug/:slug')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'slug',
    example:
      'figurka-neca-teenage-mutant-ninja-turtles---michelangelo-1990-movie',
  })
  async findOne(@Param('slug') slug: string) {
    return this.productService.findOne({
      where: { slug },
      relations: ['rating'],
    });
  }

  @Get('id/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'productId',
  })
  async getProductsById(@Param('productId') productId: string) {
    const productsId = productId.split('_');
    return this.productService.findArray(productsId);
  }

  @Post('id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: BodyProduct })
  async postProductsById(@Body() { productsId }: BodyProduct) {
    return this.productService.findArray(productsId);
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
  async getRatingProduct(
    @Param('slug') slug: string,
    @Query() query: QueryFilterRating,
  ) {
    return this.productService.getRatingProduct(slug, query);
  }
}
