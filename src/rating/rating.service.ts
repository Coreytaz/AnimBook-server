import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { RatingEntity } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ProductService } from 'src/product/product.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    private productService: ProductService,
    private userService: UsersService,
  ) {}

  async getRatingProduct(slug: string) {
    const { rating } = await this.productService.findOne({
      where: { slug },
      relations: ['rating'],
    });
    const totalRating =
      rating?.reduce((acc, cur) => acc + cur.rating, 0) / rating?.length || 0;
    const countReviews = rating.length || 0;

    return { rating, totalRating, countReviews };
  }

  async findBy(
    options?: FindManyOptions<RatingEntity>,
  ): Promise<RatingEntity[]> {
    return await this.ratingRepository.find({ ...options });
  }

  async createReviews(userId: string, dto: CreateRatingDto) {
    const user = await this.userService.findOne({ where: { id: userId } });
    const product = await this.productService.findOne({
      where: { _id: dto.productId },
    });

    const existingRating = await this.ratingRepository.findOne({
      where: {
        user: { id: user.id },
        product: { _id: product._id },
      },
    });

    if (existingRating) {
      throw new ConflictException(
        'Пользователь уже оставлял отзыв об этом продукте',
      );
    }

    const rating = await this.ratingRepository.create({
      discription: dto.discription,
      rating: dto.rating,
      product: product,
      user: user,
    });

    return this.ratingRepository.save(rating);
  }
}
