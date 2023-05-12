import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Post } from '../../models/post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit {

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private postSerice: PostService) { }

  ngOnInit() {
    this.getPosts(false)
  }

  getPosts(isInitialLoad: boolean, event?: any) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postSerice.getPosts(this.queryParams).subscribe((posts: Post[]) => {
      for (let post of posts) {
        this.allLoadedPosts.push(post);
      }

      if (isInitialLoad) event.target.complete();
      this.skipPosts = this.skipPosts + 5;
    }, (error) => {
      console.log(error);

    })

  }

  loadData(event: any) {
    this.getPosts(true, event);
  }

}
