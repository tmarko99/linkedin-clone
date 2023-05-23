import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Status } from './friend-request-status.enum';

@Entity('request')
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFriendRequest)
  creator: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequest)
  receiver: User;

  @Column()
  status: Status;
}
