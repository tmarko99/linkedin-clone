import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { Post } from '../models/post';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private errorHandlerService: ErrorHandlerService) {
    this.authService.getUserImageName().pipe(
      take(1),
      tap(({ imageName }) => {
        const defaultImagePath = 'blank-profile-picture.png';
        this.authService.updateUserImagePath(imageName || defaultImagePath).subscribe();
      })
    ).subscribe();
   }

  getPosts(params: any): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${environment.baseApiUrl}/feed${params}`).pipe(
      tap((posts: Post[]) => {
        if (posts.length === 0) throw new Error('No posts to retreive')
      }),
      catchError(
        this.errorHandlerService.handleError<Post[]>('getPosts', [])
      )
    );
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
