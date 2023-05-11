import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feed_post')
export class FeedPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
