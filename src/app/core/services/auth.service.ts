import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequest, AuthResponse } from '../models/deal.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apirul=environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }
  
  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }
  
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apirul}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.getCurrentUser().subscribe(user => {
            this.currentUserSubject.next(user);
            this.router.navigate(['/deals']);
          });
        })
      );
  }
  
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apirul}/users/me`);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN';
  }
  
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}