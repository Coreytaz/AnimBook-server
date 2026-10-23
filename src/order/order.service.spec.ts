import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/orderItem.entity';

describe('Order creation', () => {
  const dto = {
    userId: 'user',
    address: 'address',
    apartaments: '1',
    postIndex: '123456',
    amount: 990,
    products: [{ productId: 'product', count: 2 }],
  };
  const orders = {
    create: jest.fn((value) => value),
    save: jest.fn().mockResolvedValue({ _id: 'order' }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const query = jest.fn().mockResolvedValue([{ _id: 'order' }]);
  const manager = {
    getRepository: jest.fn((entity) => ({
      metadata: {
        schema: 'animbook',
        tableName:
          entity === OrderEntity
            ? 'order'
            : entity === OrderItemEntity
              ? 'orderItem'
              : 'users',
      },
    })),
  };
  const makePayment = jest.fn().mockResolvedValue({ id: 'payment' });
  const service = new OrderService(
    {
      ...orders,
      manager,
      query,
    } as unknown as Repository<OrderEntity>,
    {
      metadata: {
        relations: ['order', 'product'].map((propertyName) => ({
          propertyName,
          joinColumns: [{ databaseName: propertyName + '_id' }],
        })),
      },
    } as unknown as Repository<OrderItemEntity>,
    { findOne: jest.fn().mockResolvedValue({ _id: 'product' }) } as never,
    { makePayment } as never,
  );

  beforeEach(() => jest.clearAllMocks());

  it('inserts cart items together before requesting payment', async () => {
    await expect(service.createOrder(dto)).resolves.toEqual({ id: 'payment' });
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WITH updated_user'),
      [
        'user',
        'address',
        '1',
        '123456',
        JSON.stringify([{ productId: 'product', count: 2 }]),
      ],
    );
    expect(makePayment).toHaveBeenCalledWith({ amount: 990, orderId: 'order' });
    expect(orders.update).toHaveBeenLastCalledWith('order', {
      paymentId: 'payment',
    });
  });

  it('does not create a payment when saving cart items fails', async () => {
    query.mockRejectedValueOnce(new Error('connection reset'));
    await expect(service.createOrder(dto)).rejects.toThrow('connection reset');
    expect(makePayment).not.toHaveBeenCalled();
  });

  it('rejects a missing user without requesting payment', async () => {
    query.mockResolvedValueOnce([]);
    await expect(service.createOrder(dto)).rejects.toThrow(
      'Не удалось найти пользователя',
    );
    expect(makePayment).not.toHaveBeenCalled();
  });

  it('rejects an empty cart before writing an order', async () => {
    await expect(
      service.createOrder({ ...dto, products: [] }),
    ).rejects.toThrow();
    expect(query).not.toHaveBeenCalled();
  });

  it('returns 503 on a database disconnect without replaying writes or requesting payment', async () => {
    query.mockRejectedValueOnce({ driverError: { code: 'ECONNRESET' } });
    await expect(service.createOrder(dto)).rejects.toMatchObject({
      status: 503,
    });
    expect(query).toHaveBeenCalledTimes(1);
    expect(makePayment).not.toHaveBeenCalled();
  });

  it('handles a connection failure without replaying the atomic statement', async () => {
    query.mockRejectedValueOnce(
      Object.assign(new Error('reset'), { code: 'ECONNRESET' }),
    );
    await expect(service.createOrder(dto)).rejects.toMatchObject({
      status: 503,
    });
    expect(query).toHaveBeenCalledTimes(1);
    expect(makePayment).not.toHaveBeenCalled();
  });
});
