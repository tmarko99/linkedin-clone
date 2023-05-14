import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
