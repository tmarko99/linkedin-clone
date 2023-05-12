import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {
  @ViewChild('form') form: any;
  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }

  onPost() {
    if (!this.form.valid) return;

    const body = this.form.value['body'];

    this.modalController.dismiss({
      post: {
        body,
        createdAt: new Date()
      }
    }, 'post');
  }
}