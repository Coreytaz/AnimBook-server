import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

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
