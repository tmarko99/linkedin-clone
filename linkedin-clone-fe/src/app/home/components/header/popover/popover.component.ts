import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit {

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  constructor(private authService: AuthService, private popoverController: PopoverController) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath
    .subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath;
  });

    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }


  async onSignOut() {
    await this.popoverController.dismiss();
    this.authService.logout();
  }

}
