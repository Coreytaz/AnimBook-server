import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductService } from 'src/product/product.service';
import { PaymentService } from 'src/payment/payment.service';
import { Products, CreateOrderWithUserDto } from './dto/create-order.dto';
import { OrderEntity, Status } from './entities/order.entity';
import { OrderItemEntity } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  getDeliveries(userId: string) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  }
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    private readonly userService: UsersService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
  ) {}

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
    const user = await this.userService.update(dto.userId, {
      address: dto.address,
      apartaments: dto.apartaments,
      postIndex: dto.postIndex,
    });
    const order = this.orderRepository.create({
      user,
      address: dto.address,
      apartaments: dto.apartaments,
      postIndex: dto.postIndex,
    });
    await this.orderRepository.save(order);

    for (let i = 0; i < dto.products.length; i++) {
      const element = dto.products[i];
      await this.createItemOrder(element, order._id);
    }

    const payment = await this.paymentService.makePayment({
      amount: dto.amount,
      orderId: order._id,
    });
    order.paymentId = payment.id;
    await this.orderRepository.save(order);
    return payment;
  }
}
