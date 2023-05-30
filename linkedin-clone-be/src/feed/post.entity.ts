import { User } from './../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feed_post')
export class FeedPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  body: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (author) => author.feedPosts)
  @JoinColumn()
  author: User;
}
