import { Status } from '../entities/friend-request-status.enum';
import { User } from '../entities/user.entity';

export class FriendRequestDto {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: Status;
}
