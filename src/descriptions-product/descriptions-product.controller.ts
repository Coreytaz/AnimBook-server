import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { DescriptionsProductDto } from './dto/create-descriptions-product.dto';
import { DescriptionsProductService } from './descriptions-product.service';

@ApiTags('Descriptions-product')
@Controller('descriptions-product')
export class DescriptionsProductController {
  constructor(
    private readonly descriptionsProductService: DescriptionsProductService,
  ) {}

  @Post('create/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'productId',
    example: '24b8c31e-db83-4cc5-a769-e75ab540b4c4',
  })
  @ApiBody({ type: [DescriptionsProductDto] })
  async create(
    @Param('productId') productId: string,
    @Body() dto: DescriptionsProductDto[],
  ) {
    return this.descriptionsProductService.createDescriptions(productId, dto);
  }
}
