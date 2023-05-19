import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit, OnDestroy {
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  @Output()
  createdPost: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController, private authService: AuthService) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2'
    })

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (!data) return;

    this.createdPost.emit(data.post.body);
  }

}
