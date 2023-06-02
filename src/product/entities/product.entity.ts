import { CatergoriesEntity } from '../../catergories/entities/catergories.entity';
import { DescriptionsProductEntity } from '../../descriptions-product/entities/descriptions-product.entity';
import { OrderItemEntity } from '../../order/entities/orderItem.entity';
import { PublisherEntity } from '../../publisher/entities/publisher.entity';
import { RatingEntity } from '../../rating/entities/rating.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

interface ArrayImage {
  src: string;
  alt: string;
}

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  discription: string;

  @Column()
  price: number;

  @Column('json', { default: [] })
  img: ArrayImage[];

  @ManyToOne(() => CatergoriesEntity, (category) => category.products)
  category: CatergoriesEntity;

  @ManyToOne(() => PublisherEntity, (publisher) => publisher.products)
  publisher: PublisherEntity;

  @OneToMany(() => RatingEntity, (rating) => rating.product)
  rating: RatingEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemEntity[];

  @OneToMany(
    () => DescriptionsProductEntity,
    (description) => description.product,
  )
  descriptions: DescriptionsProductEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
