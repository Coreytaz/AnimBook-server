import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { PaymentService } from './payment.service';

jest.mock('axios');
const request = axios as jest.MockedFunction<typeof axios>;

describe('PaymentService', () => {
  const service = new PaymentService(
    new ConfigService({ API_FRONT: 'https://example.test' }),
  );

  beforeEach(() => jest.clearAllMocks());

  it('uses a stable order key and decimal currency amount', async () => {
    request.mockResolvedValueOnce({ data: { id: 'payment' } });
    await expect(
      service.makePayment({ amount: 990, orderId: 'order' }),
    ).resolves.toEqual({ id: 'payment' });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 15000,
        headers: expect.objectContaining({ 'Idempotence-Key': 'order' }),
        data: expect.objectContaining({
          amount: { value: '990.00', currency: 'RUB' },
        }),
      }),
    );
  });

  it('returns a serializable error without exposing the Axios request', async () => {
    const error = { config: { auth: { password: 'secret' } }, request: null };
    error.request = error;
    request.mockRejectedValueOnce(error);
    try {
      await service.makePayment({ amount: 990, orderId: 'order' });
      throw new Error('Expected rejection');
    } catch (result) {
      if (!(result instanceof HttpException)) throw result;
      expect(result.getStatus()).toBe(502);
      expect(JSON.stringify(result.getResponse())).not.toContain('secret');
    }
  });
});
