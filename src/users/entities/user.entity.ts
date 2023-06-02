import { OrderEntity } from '../../order/entities/order.entity';
import { RatingEntity } from '../../rating/entities/rating.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  username?: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ default: null })
  address?: string;

  @Column({ default: null })
  postIndex?: string;

  @Column({ default: null })
  apartaments?: string;

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  rating: RatingEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
