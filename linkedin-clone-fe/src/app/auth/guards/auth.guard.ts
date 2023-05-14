import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.isUserLoggedIn.pipe(
      take(1),
      switchMap((isUserLoggedIn: any) => {
        if (isUserLoggedIn) {
          return of(isUserLoggedIn);
        }
        return this.authService.isTokenInStorage();
      }),
      tap((isUserLoggedIn: boolean) => {
        if (!isUserLoggedIn) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

}

export const AuthGuard: CanMatchFn = (): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  return inject(PermissionsService).canLoad();
}
