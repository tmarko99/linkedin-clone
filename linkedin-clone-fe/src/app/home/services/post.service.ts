import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient) { }

  getPosts(params: any): Observable<Post[]> {
    return this.httpClient.get<Post[]>('http://localhost:3000/api/feed' + params);
  }
}
