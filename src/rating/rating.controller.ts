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
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    example: '24b8c31e-db83-4cc5-a769-e75ab540b4c4',
    required: true,
    name: 'productId',
  })
  async find(@Param('productId') productId: string) {
    return this.ratingService.findByProductId(productId);
  }

  @Post('/create/:userId')
  @ApiParam({
    required: true,
    name: 'userId',
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  @HttpCode(HttpStatus.OK)
  async create(@Param('userId') userId: string, @Body() dto: CreateRatingDto) {
    return this.ratingService.createReviews(userId, dto);
  }
}
