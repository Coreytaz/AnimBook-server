import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemEntity } from './orderItem.entity';

export enum Status {
  AwaitingPayment = 'Ожидает оплаты',
  AwaitingСonfirmation = 'Ожидает подтверждения',
  InTransit = 'В пути',
  Delivered = 'Доставлен',
}

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ default: null })
  paymentId: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @Column({ default: Status.AwaitingPayment })
  status: Status;

  @Column()
  address: string;

  @Column()
  postIndex: string;

  @Column()
  apartaments: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
