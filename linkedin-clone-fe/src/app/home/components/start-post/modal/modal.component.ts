import { take } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit, OnDestroy {

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null!);
  fullName = '';

  @ViewChild('form') form: any;

  @Input()
  postId?: number;

  constructor(public modalController: ModalController, private authService: AuthService) { }

  ngOnInit() {
    this.authService.userFullName.pipe(take(1)).subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });

    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }

  onPost() {
    if (!this.form.valid) return;

    const body = this.form.value['body'];

    this.modalController.dismiss({
      post: {
        body
      }
    }, 'post');
  }
}
