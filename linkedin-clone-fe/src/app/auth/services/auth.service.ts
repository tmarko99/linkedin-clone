import { Injectable } from '@angular/core';
import { UserRegister } from '../models/user-register.model';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Role, User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { GetResult, Preferences } from '@capacitor/preferences';
import { UserResponse } from '../models/user-response.model';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null!);

  constructor(private httpClient: HttpClient, private router: Router) { }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = !!user;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.role)
      })
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user.id)
      })
    );
  }

  register(userRegister: UserRegister): Observable<User> {
    return this.httpClient.post<User>(`${environment.baseApiUrl}/auth/register`, userRegister)
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(`${environment.baseApiUrl}/auth/login`, { email, password})
      .pipe(
        take(1),
        tap((response: { token: string} ) => {
          Preferences.set({
            key: 'token',
            value: response.token
          });
          const decodedToken: UserResponse = jwt_decode(response.token);

          this.user$.next(decodedToken.user);
        })
      );
  }

  isTokenInStorage(): Observable<boolean | null | undefined> {
    return from(Preferences.get({ key: 'token' })).pipe(
      map((data: GetResult ) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMs = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMs);

        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }

        return null;
      })
    );
  }

  logout(): void {
    this.user$.next(null!);
    Preferences.remove({ key: 'token' });
    this.router.navigateByUrl('/auth');
  }
}
