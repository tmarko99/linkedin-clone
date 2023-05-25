import { FriendRequestStatus, FriendRequestStatusEnum } from './../../models/friend-request';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { FriendRequest } from '../../models/friend-request';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit, OnDestroy {

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  private friendRequestsSubscription: Subscription;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService
  ) {}

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
    });

    this.friendRequestsSubscription = this.connectionProfileService.getFriendRequests()
      .subscribe((friendRequests: FriendRequest[]) => {
        this.connectionProfileService.friendRequests = friendRequests.filter((friendRequest: FriendRequest) => {
          friendRequest.status === 'pending' as FriendRequestStatus;
        })
      });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: e,
      showBackdrop: false
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    // console.log(`Popover dismissed with role: ${role}`);

  }

  async presentFriendRequestsPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: e,
      showBackdrop: false
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    // console.log(`Popover dismissed with role: ${role}`);

  }

}
