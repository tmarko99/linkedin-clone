import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Post } from '../../models/post';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit, OnChanges {

  @Input()
  postBody: string;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  userId$ = new BehaviorSubject<number>(null!);

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private postSerice: PostService,
    private authService: AuthService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.getPosts(false);

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId$.next(userId);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const postBody = changes['postBody'].currentValue;
    if (postBody) {
      this.postSerice.createPost(postBody).subscribe((post: Post) => {
        this.allLoadedPosts.unshift(post);
      })
    }
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

  async presentUpdateModal(postId: number) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
      componentProps: {
        postId,
      }
    })

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (!data) return;

    const newPostBody = data.post.body;

    this.postSerice.updatePost(postId, newPostBody).subscribe(() => {
      const postIndex = this.allLoadedPosts.findIndex((post: Post) => post.id === postId);
      this.allLoadedPosts[postIndex].body = newPostBody;
    })
  }

  deletePost(postId: number) {
    this.postSerice.deletePost(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter((post: Post) => post.id !== postId);
    })
  }

}
