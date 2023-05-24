import { ProductEntity } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('catergories')
export class CatergoriesEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column()
  img: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => CatergoriesEntity, (category) => category.parentCategory)
  subcategories: CatergoriesEntity[];

  @ManyToOne(() => CatergoriesEntity, (category) => category.subcategories)
  parentCategory: CatergoriesEntity;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
