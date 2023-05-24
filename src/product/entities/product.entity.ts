import { CatergoriesEntity } from 'src/catergories/entities/catergories.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  img: string;

  @ManyToOne(() => CatergoriesEntity, (category) => category.products)
  category: CatergoriesEntity;

  @OneToMany(() => RatingEntity, (rating) => rating.product)
  rating: RatingEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
