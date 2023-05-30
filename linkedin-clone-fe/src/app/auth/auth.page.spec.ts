import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { HttpClientModule, HttpErrorResponse } from "@angular/common/http";
import { UserRegister } from "./models/user-register.model";
import { AuthPage } from "./auth.page";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AuthService } from "./services/auth.service";
import { User } from "./models/user.model";
import { FormsModule, NgForm } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;

  let routerSpy: Partial<Router>;

  const mockNewUser: UserRegister = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    password: 'password'
  };

  const mockUser: User = {
    id: 1,
    firstName: mockNewUser.firstName,
    lastName: mockNewUser.lastName,
    email: mockNewUser.email,
    role: 'user',
    imagePath: null,
    posts: null
  };

  const mockAuthService: Partial<AuthService> = {
    register: () => of(mockUser),
    login: () => of({ token: 'jwt' }),
  };

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [FormsModule, IonicModule],
      declarations: [AuthPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form = {
      value: mockNewUser
    } as NgForm;
    fixture.detectChanges();
  }));

  it('should create with form values', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      expect(component.form.value).toEqual(mockNewUser);
    });
  }));

  it('should have initial submition type of login', () => {
    expect(component.submissionType).toEqual('login');
  });

  it('should toggle submition type to join', () => {
    component.toggleText();
    fixture.detectChanges();
    expect(component.submissionType).toEqual('join');
  });

  it('should route to home page upon login', () => {
    expect(component.submissionType).toEqual('login');
    component.onSubmit();
    const spy = routerSpy.navigateByUrl as jasmine.Spy;
    const navigationArgs = spy.calls.first().args[0];

    expect(navigationArgs).toBe('/home');
  });

  it('should toggle submition type to logni after registration', () => {
    expect(component.submissionType).toEqual('login');
    component.toggleText();
    expect(component.submissionType).toEqual('join');
    component.onSubmit();
    expect(component.submissionType).toEqual('login');
  });
})
