import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banner')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  url: string;

  @Column()
  img: string;

  @Column()
  caption: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
