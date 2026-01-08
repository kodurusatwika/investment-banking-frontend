/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    
    const result = guard.canActivate();
    
    expect(result).toBeTruthy();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    
    const result = guard.canActivate();
    
    expect(result).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});