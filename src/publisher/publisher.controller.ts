import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PublisherProductDto } from './dto/create-publisher.dto';

@ApiTags('Publisher')
@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post('create/:categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    required: true,
    name: 'categoryId',
  })
  async create(
    @Param('categoryId') categoryId: string,
    @Body() dto: PublisherProductDto,
  ) {
    return this.publisherService.createPublisher(categoryId, dto);
  }
}
