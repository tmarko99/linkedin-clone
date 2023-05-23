import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { FriendRequest, FriendRequestStatus } from '../models/friend-request';

@Injectable({
  providedIn: 'root'
})
export class ConnectionProfileService {
  friendRequests: FriendRequest[];

  constructor(private httpClient: HttpClient) { }

  getUserConnections(id: number): Observable<User> {
    return this.httpClient.get<User>(`${environment.baseApiUrl}/user/${id}`);
  }

  getFriendRequestStatus(id: number): Observable<FriendRequestStatus> {
    return this.httpClient.get<FriendRequestStatus>(`${environment.baseApiUrl}/user/friend-request/status/${id}`);
  }

  addConnectionUser(id: number): Observable<FriendRequest | { error: string }> {
    return this.httpClient.post<FriendRequest | { error: string }>(
      `${environment.baseApiUrl}/friend-request/send/${id}`, {}
      );
  }

  getFriendRequests(): Observable<FriendRequest[]> {
    return this.httpClient.get<FriendRequest[]>(`${environment.baseApiUrl}/user/friend-request/me/received-requests`);
  }

  respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined'): Observable<FriendRequest> {
    return this.httpClient.put<FriendRequest>(`${environment.baseApiUrl}/friend-request/response/${id}`, { status: statusResponse });
  }
}
