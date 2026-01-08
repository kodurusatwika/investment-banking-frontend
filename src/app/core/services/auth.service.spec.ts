/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { User, Role } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should login successfully and store token', () => {
      const credentials = { username: 'admin', password: 'admin123' };
      const mockResponse = {
        token: 'jwt-token',
        username: 'admin',
        role: 'ADMIN'
      };
      const mockUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@bank.com',
        role: Role.ADMIN,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      };

      // Mock the getCurrentUser call
      spyOn(service, 'getCurrentUser').and.returnValue(of(mockUser));

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('token')).toBe('jwt-token');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/deals']);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const credentials = { username: 'admin', password: 'wrong' };
      const errorResponse = { status: 401, statusText: 'Unauthorized' };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
      req.flush('Invalid credentials', errorResponse);
    });
  });

  describe('logout', () => {
    it('should clear token and redirect to login', () => {
      localStorage.setItem('token', 'jwt-token');
      spyOn(service['currentUserSubject'], 'next');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(service['currentUserSubject'].next).toHaveBeenCalledWith(null);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      const adminUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@bank.com',
        role: Role.ADMIN,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      };
      spyOn(service as any, 'getCurrentUser').and.returnValue(adminUser);

      expect(service.isAdmin()).toBeTruthy();
    });

    it('should return false for non-admin user', () => {
      const user: User = {
        id: 2,
        username: 'john',
        email: 'john@bank.com',
        role: Role.USER,
        active: true,
        createdAt: '2024-01-01T00:00:00Z'
      };
      spyOn(service as any, 'getCurrentUser').and.returnValue(user);

      expect(service.isAdmin()).toBeFalsy();
    });
  });
});