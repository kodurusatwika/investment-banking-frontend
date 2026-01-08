import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { User, Role, CreateUser } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  
  userForm: FormGroup;
  showForm = false;
  
  roles = Object.values(Role);
  
  displayedColumns: string[] = [
    'username', 'email', 'role', 'active', 'createdAt', 'actions'
  ];
  
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      const userData: CreateUser = this.userForm.value;
      
      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.users.push(user);
          this.userForm.reset({ role: 'USER' });
          this.showForm = false;
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Failed to create user', 
            'Close', 
            { duration: 3000 }
          );
          this.loading = false;
        }
      });
    }
  }
  
  updateUserStatus(user: User, active: boolean): void {
    this.userService.updateUserStatus(user.id, active).subscribe({
      next: (updatedUser) => {
        user.active = updatedUser.active;
        this.snackBar.open(
          `User ${active ? 'activated' : 'deactivated'} successfully`, 
          'Close', 
          { duration: 3000 }
        );
      },
      error: (error) => {
        this.snackBar.open('Failed to update user status', 'Close', { duration: 3000 });
      }
    });
  }
  
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  
  getRoleDisplay(role: Role): string {
    return role === Role.ADMIN ? 'Administrator' : 'User';
  }
}