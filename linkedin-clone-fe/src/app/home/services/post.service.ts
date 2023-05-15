import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Post } from '../models/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  getPosts(params: any): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${environment.baseApiUrl}/feed${params}`);
  }

  createPost(postBody: string): Observable<Post> {
    return this.httpClient.post<Post>(`${environment.baseApiUrl}/feed`, postBody).pipe(take(1));
  }

  updatePost(postId: number, postBody: string) {
    return this.httpClient.put(`${environment.baseApiUrl}/feed/${postId}`, postBody).pipe(take(1));
  }

  deletePost(postId: number) {
    return this.httpClient.delete(`${environment.baseApiUrl}/feed/${postId}`).pipe(take(1));
  }
}
