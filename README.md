# Investment_Banking_Frontend

This is the frontend application for my capstone project **Investment Banking Deal Pipeline Management System**.

The frontend is developed using **Angular** and communicates with a **Spring Boot backend** through REST APIs secured with **JWT authentication**.

## Technologies Used
- Angular
- TypeScript
- Angular Material
- Reactive Forms
- Angular Router
- JWT Authentication

## Features
- User login using JWT authentication
- Role-based access control (ADMIN and USER)
- View and manage investment banking deals
- Update deal stages and add notes
- Admin-only user management screens
- Secure API communication using HTTP interceptors

## Roles
**USER**
- View deals
- Create deals
- Update deal stage
- Add notes

**ADMIN**
- All USER permissions
- Manage users
- Access sensitive deal information

## Backend Integration
- Connects to Spring Boot backend
- JWT token is attached to every request using an HTTP interceptor
- Protected routes using AuthGuard and RoleGuard

## How to Run the Project
```bash
npm install
ng serve

The application will run on:
http://localhost:4200
