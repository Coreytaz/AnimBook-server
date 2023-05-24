import { RatingEntity } from 'src/rating/entities/rating.entity';
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

  @OneToMany(() => RatingEntity, (rating) => rating.user)
  rating: RatingEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
