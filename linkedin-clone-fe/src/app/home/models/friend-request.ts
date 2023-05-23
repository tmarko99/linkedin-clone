import { User } from "src/app/auth/models/user.model";

export type FriendRequestStatusEnum =
  | 'not-sent'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'waiting-for-current-user-response';

export interface FriendRequestStatus {
  status?: FriendRequestStatusEnum;
}

export interface FriendRequest {
  id: number;
  creator: User;
  receiver: User;
  status: FriendRequestStatus;
  fullImagePath?: string;
}
