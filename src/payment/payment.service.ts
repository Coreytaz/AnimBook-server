import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MakePaymentDto } from './dto/make-payment.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PaymentCheck, PaymentCreate } from './types';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async makePayment(dto: MakePaymentDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post<PaymentCreate>(
            'https://api.yookassa.ru/v3/payments',
            {
              amount: {
                value: dto.amount,
                currency: 'RUB',
              },
              capture: true,
              confirmation: {
                type: 'redirect',
                return_url: `${this.configService.get(
                  'API_FRONT',
                )}/cart/result/${dto.orderId}`,
              },
              description: `Заказ №${dto.orderId}`,
            },
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': Date.now(),
              },
              auth: {
                username: '215073',
                password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async checkPayment(paymentId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<PaymentCheck>(
            `https://api.yookassa.ru/v3/payments/${paymentId}`,
            {
              method: 'GET',
              auth: {
                username: '215073',
                password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
              },
            },
          )
          .pipe(
            catchError((error) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
