import { take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

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

  constructor(private authService: AuthService) { }

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


  onSignOut() {
    this.authService.logout();
  }

}
