import { ProductEntity } from 'src/product/entities/product.entity';
import { PublisherEntity } from 'src/publisher/entities/publisher.entity';
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

  @Column({ default: null })
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

  @OneToMany(() => PublisherEntity, (publisher) => publisher.category)
  publisher: PublisherEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
