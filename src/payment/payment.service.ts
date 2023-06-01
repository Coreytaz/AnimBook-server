import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MakePaymentDto } from './dto/make-payment.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async makePayment(dto: MakePaymentDto) {
    try {
      const { data } = await this.httpService.axiosRef({
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now(),
        },
        auth: {
          username: '215073',
          password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
        },
        data: {
          amount: {
            value: dto.amount,
            currency: 'RUB',
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: `${this.configService.get('API_FRONT')}/cart/result/${
              dto.orderId
            }`,
          },
          description: `Заказ №${dto.orderId}`,
        },
      });

      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async checkPayment(paymentId: string) {
    try {
      const { data } = await this.httpService.axiosRef({
        method: 'GET',
        url: `https://api.yookassa.ru/v3/payments/${paymentId}`,
        auth: {
          username: '215073',
          password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
        },
      });

      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
