import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUser,User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}
  
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }
  
  createUser(user: CreateUser): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, user);
  }
  
  updateUserStatus(id: number, active: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${id}/status?active=${active}`, {});
  }
}