import { Router } from "@angular/router";
import { UserRegister } from "../models/user-register.model";
import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

let httpClientSpy: { post: jasmine.Spy };
let routerSpy: Partial<Router>;

let authService: AuthService;

describe('AuthService', () => {
  const mockNewUser: UserRegister = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: 'password'
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    authService = new AuthService(httpClientSpy as any, routerSpy as any);
  });

  describe('register', () => {
    it('should return the user', (done: DoneFn) => {
      const expectedUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        role: 'user',
        imagePath: null,
        posts: null
      };

      httpClientSpy.post.and.returnValue(of(expectedUser));

      authService.register(mockNewUser).subscribe((user: User) => {
        expect(typeof user.id).toBe('number');
        expect(user.firstName).toEqual(mockNewUser.firstName);
        expect(user.lastName).toEqual(mockNewUser.lastName);
        expect(user.email).toEqual(mockNewUser.email);
        expect((user as any).password).toBeUndefined();
        expect(user.role).toEqual('user');
        expect(user.imagePath).toBeNull();

        done();
      });

      expect(httpClientSpy.post.calls.count()).toBe(1);
    });

    it('should return an error if email already exists', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({
        error: 'A user had already been created with this email address',
        status: 400
      });

      httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

      authService.register(mockNewUser).subscribe({
        next: () => {
          done.fail('expected a bad request error')
        },
        error: (httpErrorResponse: HttpErrorResponse) => {
          expect(httpErrorResponse.error).toContain('already been created');
          done();
        }
      });
    })
  });
})
