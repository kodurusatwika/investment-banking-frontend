import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'Deal Pipeline Portal';
  currentUser: User | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$().subscribe(user => {
      this.currentUser = user;
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
}