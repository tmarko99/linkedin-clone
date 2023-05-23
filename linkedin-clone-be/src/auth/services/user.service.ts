import { Injectable } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { Status } from '../entities/friend-request-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          id,
        },
        relations: ['feedPosts'],
      }),
    ).pipe(
      map((user: User) => {
        delete user.password;

        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new User();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.imagePath;
      }),
    );
  }

  sendConnectionRequest(
    receiverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id)
      return of({ error: 'It is not possible to add yourself!' });

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              return of({
                error:
                  'A friend request has already been sent or received to your account',
              });
            const friendRequst = {
              creator,
              receiver,
              status: Status.PENDING,
            };
            return from(this.friendRequestRepository.save(friendRequst));
          }),
        );
      }),
    );
  }

  getFriendRequstStatus(
    receiverId: number,
    creator: User,
  ): Observable<{ status: Status }> {
    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            where: [
              {
                creator,
                receiver,
              },
              {
                creator: receiver,
                receiver: creator,
              },
            ],
            relations: ['creator', 'receiver'],
          }),
        );
      }),
      switchMap((friendRequst: FriendRequest) => {
        if (friendRequst.receiver.id === creator.id) {
          return of({ status: Status.WAITING_FOR_CURRENT_USER_RESPONSE });
        }
        return of({ status: friendRequst.status || Status.NOT_SEND });
      }),
    );
  }

  respondToFriendRequstStatus(
    friendRequestId: number,
    status: Status,
  ): Observable<{ status: Status }> {
    return this.getFriendRequstUserById(friendRequestId).pipe(
      switchMap((friendRequst: FriendRequest) => {
        return from(
          this.friendRequestRepository.save({
            ...friendRequst,
            status,
          }),
        );
      }),
    );
  }

  getMyFriendRequsts(currentUser: User): Observable<FriendRequest[]> {
    return from(
      this.friendRequestRepository.find({
        where: { receiver: currentUser },
        relations: ['receiver', 'creator'],
      }),
    );
  }

  private getFriendRequstUserById(
    friendRequstId: number,
  ): Observable<FriendRequest> {
    return from(
      this.friendRequestRepository.findOne({ where: { id: friendRequstId } }),
    );
  }

  private hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequst: FriendRequest) => {
        if (!friendRequst) return of(false);

        return of(true);
      }),
    );
  }
}
