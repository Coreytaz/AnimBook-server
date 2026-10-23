import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { MakePaymentDto } from './dto/make-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}

  async makePayment(dto: MakePaymentDto) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': dto.orderId,
        },
        auth: {
          username: '215073',
          password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
        },
        data: {
          amount: {
            value: dto.amount.toFixed(2),
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
      this.handlePaymentError(error);
    }
  }

  async checkPayment(paymentId: string) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `https://api.yookassa.ru/v3/payments/${paymentId}`,
        timeout: 15000,
        auth: {
          username: '215073',
          password: 'test_FevXsgz4-yKXptOaLNzloeqKI79o_7oR7j89hqudydg',
        },
      });

      return data;
    } catch (error) {
      this.handlePaymentError(error);
    }
  }

  private handlePaymentError(error: unknown): never {
    if (
      axios.isAxiosError(error) &&
      ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)
    ) {
      throw new GatewayTimeoutException(
        'Сервис оплаты не ответил. Попробуйте позже.',
      );
    }
    // Axios errors contain circular request objects and authentication data.
    throw new BadGatewayException(
      'Не удалось связаться с сервисом оплаты. Попробуйте позже.',
    );
  }
}
