import { Component } from '@angular/core';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  body = '';

  constructor(private postService: PostService) {}

  onCreatePost(body: string) {
    this.body = body;
  }

}
