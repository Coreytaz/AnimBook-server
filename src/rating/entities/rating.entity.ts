import { ProductEntity } from 'src/product/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rating')
export class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  discription: string;

  @Column()
  rating: number;

  @ManyToOne(() => ProductEntity, (product) => product.rating)
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user)
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
