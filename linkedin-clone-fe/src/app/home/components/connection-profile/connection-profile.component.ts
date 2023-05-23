import { Component, OnDestroy, OnInit } from '@angular/core';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription, map, switchMap, take, tap } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequestStatus, FriendRequestStatusEnum } from '../../models/friend-request';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit, OnDestroy{
  user: User;
  friendRequestStatus: FriendRequestStatusEnum;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  constructor(
    private connectionProfileService: ConnectionProfileService,
    private route: ActivatedRoute,
    public bannerColorService: BannerColorService) { }

  ngOnInit() {
    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus().pipe(
      tap((friendRequestStatus: FriendRequestStatus) => {
        this.friendRequestStatus = friendRequestStatus.status!;
        this.userSubscription$ = this.getUser().subscribe((user: User) => {
          this.user = user;
          const imagePath = user.imagePath ?? 'blank-profile-picture.png';
          this.user.fullImagePath = 'http://localhost:3000/api/feed/image/' + imagePath;
        })
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
    this.friendRequestStatusSubscription$.unsubscribe();
  }

  getUser(): Observable<User> {
    return this.getUserId().pipe(
      switchMap((id: number) => {
        return this.connectionProfileService.getUserConnections(id);
      })
    )
  }

  addUser(): Subscription {
    this.friendRequestStatus = 'pending';
    return this.getUserId().pipe(
      switchMap((id: number) => {
        return this.connectionProfileService.addConnectionUser(id);
      })
    ).pipe(take(1)).subscribe();

  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserId().pipe(
      switchMap((id: number) => {
        return this.connectionProfileService.getFriendRequestStatus(id);
      })
    )
  }

  private getUserId(): Observable<number> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return +params.get('id')!;
      })
    )
  }

}
