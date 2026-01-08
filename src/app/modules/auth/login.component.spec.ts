/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.get('username')?.setValue('admin');
    expect(form.get('username')?.valid).toBeTruthy();
    
    form.get('password')?.setValue('admin123');
    expect(form.get('password')?.valid).toBeTruthy();
    expect(form.valid).toBeTruthy();
  });

  it('should call authService.login on valid form submission', fakeAsync(() => {
    const mockResponse = { token: 'jwt-token', username: 'admin', role: 'ADMIN' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      username: 'admin',
      password: 'admin123'
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin123'
    });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Login successful', 'Close', { duration: 3000 });
  }));

  it('should handle login error', fakeAsync(() => {
    const error = { error: { message: 'Invalid credentials' } };
    authServiceSpy.login.and.returnValue(throwError(() => error));

    component.loginForm.setValue({
      username: 'admin',
      password: 'wrong'
    });

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Invalid credentials', 'Close', { duration: 3000 });
  }));

  it('should not submit invalid form', () => {
    component.loginForm.setValue({
      username: '',
      password: ''
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should show loading spinner during login', fakeAsync(() => {
    const mockResponse = { token: 'jwt-token', username: 'admin', role: 'ADMIN' };
    authServiceSpy.login.and.returnValue(of(mockResponse));

    component.loginForm.setValue({
      username: 'admin',
      password: 'admin123'
    });

    component.onSubmit();
    
    expect(component.loading).toBeTruthy();
    
    tick();
    
    expect(component.loading).toBeFalsy();
  }));
});