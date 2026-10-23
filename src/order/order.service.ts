import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { ProductService } from '../product/product.service';
import { PaymentService } from '../payment/payment.service';
import { Products, CreateOrderWithUserDto } from './dto/create-order.dto';
import { OrderEntity, Status } from './entities/order.entity';
import { OrderItemEntity } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
  ) {}

  async getDeliveries(userId: string) {
    return await this.orderRepository.find({
      where: {
        user: { id: userId },
        status: Any([
          Status.AwaitingPayment,
          Status.AwaitingСonfirmation,
          Status.InTransit,
        ]),
      },
    });
  }

  async getDeliveried(userId: string) {
    return await this.orderRepository.find({
      where: {
        user: { id: userId },
        status: Any([Status.Delivered]),
      },
    });
  }

  async getOrder(orderId: string) {
    return await this.orderRepository.findOne({
      where: {
        _id: orderId,
      },
      relations: { items: { product: { rating: true } } },
    });
  }

  async findOneOrder(
    options: FindOneOptions<OrderEntity>,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ ...options });

    if (!order) {
      throw new BadRequestException(
        'Не удалось найти заказ',
        'Неверный запрос',
      );
    }

    return order;
  }

  async checkPayments(orderId: string) {
    const order = await this.findOneOrder({ where: { _id: orderId } });
    const data = await this.paymentService.checkPayment(order.paymentId);
    if (data.status === 'succeeded') {
      order.status = Status.AwaitingСonfirmation;
      this.orderRepository.save(order);
      return data;
    }
    if (data.status === 'pending') {
      return data;
    }
  }

  async createItemOrder({ productId, count }: Products, orderId: string) {
    const product = await this.productService.findOne({
      where: { _id: productId },
    });
    const order = await this.findOneOrder({ where: { _id: orderId } });

    const orderItem = await this.orderItemRepository.create({
      order,
      product,
      quantity: count,
    });

    return await this.orderItemRepository.save(orderItem);
  }

  async createOrder(dto: CreateOrderWithUserDto) {
    if (
      !dto.products?.length ||
      dto.products.some(({ count }) => !Number.isInteger(count) || count <= 0)
    ) {
      throw new BadRequestException('Укажите товары и корректное количество');
    }

    // Resolve products before writing so invalid carts cannot leave empty orders.
    const products = await Promise.all(
      dto.products.map(({ productId }) =>
        this.productService.findOne({ where: { _id: productId } }),
      ),
    );
    // One PostgreSQL statement keeps all writes atomic across database proxies.
    // Separate BEGIN/INSERT/COMMIT requests can lose their session mid-checkout.
    const manager = this.orderRepository.manager;
    const table = (
      entity: typeof OrderEntity | typeof OrderItemEntity | typeof UserEntity,
    ) => {
      const metadata = manager.getRepository(entity).metadata;
      return [metadata.schema, metadata.tableName]
        .filter(Boolean)
        .map((name) => '"' + name.replace(/"/g, '""') + '"')
        .join('.');
    };
    const itemMetadata = this.orderItemRepository.metadata;
    const relationColumn = (property: string) => {
      const name = itemMetadata.relations.find(
        (relation) => relation.propertyName === property,
      ).joinColumns[0].databaseName;
      return '"' + name.replace(/"/g, '""') + '"';
    };
    const rows: { _id: string }[] = await this.orderRepository
      .query(
        `WITH updated_user AS (
        UPDATE ${table(UserEntity)} SET address = $2, apartaments = $3,
          "postIndex" = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1::uuid RETURNING id
      ), new_order AS (
        INSERT INTO ${table(OrderEntity)} ("userId", address, apartaments, "postIndex")
        SELECT id, $2, $3, $4 FROM updated_user RETURNING "_id"
      ), new_items AS (
        INSERT INTO ${table(OrderItemEntity)} (${relationColumn('order')}, ${relationColumn('product')}, quantity)
        SELECT new_order."_id", item."productId"::uuid, item.count
        FROM new_order CROSS JOIN jsonb_to_recordset($5::jsonb)
          AS item("productId" text, count integer)
        RETURNING "_id"
      ) SELECT "_id" FROM new_order`,
        [
          dto.userId,
          dto.address,
          dto.apartaments,
          dto.postIndex,
          JSON.stringify(
            dto.products.map(({ count }, index) => ({
              productId: products[index]._id,
              count,
            })),
          ),
        ],
      )
      .catch((error: unknown) => {
        const databaseError = error as {
          code?: string;
          driverError?: { code?: string };
        } | null;
        const code = databaseError?.driverError?.code ?? databaseError?.code;
        if (
          code &&
          [
            'ECONNRESET',
            'ECONNREFUSED',
            'ETIMEDOUT',
            '57P01',
            '57P02',
            '57P03',
            '08006',
          ].includes(code)
        ) {
          // Do not replay writes: a disconnect during COMMIT has an unknown outcome.
          throw new ServiceUnavailableException(
            'Соединение с базой данных прервано. Проверьте список заказов перед повторным оформлением.',
            { cause: error },
          );
        }
        throw error;
      });

    const order = rows[0];
    if (!order) {
      throw new BadRequestException('Не удалось найти пользователя');
    }

    const payment = await this.paymentService.makePayment({
      amount: dto.amount,
      orderId: order._id,
    });
    await this.orderRepository.update(order._id, { paymentId: payment.id });
    return payment;
  }
}
