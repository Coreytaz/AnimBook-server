import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderWithUserDto } from './dto/create-order.dto';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiParam({
    required: true,
    name: 'userId',
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  @Get('deliveries/:userId')
  getDeliveries(@Param() { userId }: { userId: string }) {
    return this.orderService.getDeliveries(userId);
  }

  @ApiParam({
    required: true,
    name: 'userId',
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  @Get('deliveried/:userId')
  getDeliveried(@Param() { userId }: { userId: string }) {
    return this.orderService.getDeliveried(userId);
  }

  @ApiParam({
    required: true,
    name: 'orderId',
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  @Get('getOrder/:orderId')
  getOrder(@Param() { orderId }: { orderId: string }) {
    return this.orderService.getOrder(orderId);
  }

  @ApiParam({
    required: true,
    name: 'orderId',
    example: '20ab6ec3-84e1-440e-af36-3bc2eb86f999',
  })
  @Get('checkPayments/:orderId')
  checkPayments(@Param() { orderId }: { orderId: string }) {
    return this.orderService.checkPayments(orderId);
  }

  @Post('create/withUser')
  makePayment(@Body() dto: CreateOrderWithUserDto) {
    return this.orderService.createOrder(dto);
  }
}
