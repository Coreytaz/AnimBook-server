import { CatergoriesEntity } from '../../catergories/entities/catergories.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('publisher')
export class PublisherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  city: string;

  @ManyToOne(() => CatergoriesEntity, (category) => category.publisher)
  category: CatergoriesEntity;

  @OneToMany(() => ProductEntity, (product) => product.publisher)
  products: ProductEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
