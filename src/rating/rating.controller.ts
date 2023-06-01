import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateRatingDto) {
    return this.ratingService.createReviews(dto);
  }
}
