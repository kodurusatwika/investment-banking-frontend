# Investment_Banking_Frontend

A secure, role-based **Investment Banking Deal Pipeline Management Frontend** built with **Angular 17** and **Angular Material**. This application enables investment banking teams to track, manage, and collaborate on high-value deals while ensuring data security, controlled access, and scalability.

---

## 📌 Problem Statement

Small and mid-sized investment banks often rely on spreadsheets, emails, and disconnected tools to manage deal pipelines. This leads to:

* Scattered deal information across Excel sheets, emails, and chats
* Multiple versions of the same spreadsheet edited by different users
* No role-based visibility for sensitive financial data
* Unstructured collaboration through emails and chat tools
* Shared spreadsheets resulting in uncontrolled access

---

## ✅ Solution Overview

This frontend is part of a **secure, centralized Deal Pipeline Management Portal** that:

1. Centralizes all deal-related data
2. Enforces role-based access (USER vs ADMIN)
3. Protects sensitive financial information
4. Tracks the complete deal lifecycle (Prospect → Evaluation → Closure)
5. Enables structured collaboration via notes
6. Scales with team and deal growth
7. Aligns with modern security and compliance expectations

---

## 🧱 Technology Stack

### Frontend

| Layer                 | Technology                    |
| --------------------- | ----------------------------- |
| Framework             | Angular 17                    |
| UI Library            | Angular Material              |
| State Management      | Angular Services              |
| HTTP                  | HttpClientModule              |
| Forms                 | Reactive Forms                |
| Routing               | Angular Router                |
| Styling               | CSS / Angular Material Themes |
| Interceptors          | JWT Auth Interceptor          |
| Backend Communication | REST API                      |

---

## 🏗️ System Architecture

The Investment Banking Deal Pipeline Management System follows a **layered, client-server architecture** ensuring scalability, security, and maintainability.

### 🔹 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│                     localhost:4200                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               ANGULAR FRONTEND (SPA)                │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │           COMPONENTS & MODULES              │   │   │
│   │  │  Login | Deals | Admin | Shared Modules     │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │        SERVICES & INTERCEPTORS               │   │   │
│   │  │  • Auth Service (JWT)                        │   │   │
│   │  │  • Deal Service (REST Calls)                 │   │   │
│   │  │  • JWT Auth Interceptor                      │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   └───────────────────────────┬─────────────────────────┘   │
│                               │ HTTP/HTTPS (REST + JWT)      │
└───────────────────────────────┼─────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER LAYER                              │
│                    localhost:8080                            │
├─────────────────────────────────────────────────────────────┤
│   ┌─────────────────────────────────────────────────────┐   │
│   │              SPRING BOOT BACKEND                    │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │         SPRING SECURITY FILTER CHAIN         │   │   │
│   │  │  • JWT Authentication                        │   │   │
│   │  │  • Role-Based Authorization                  │   │   │
│   │  │  • CORS Configuration                        │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │          REST CONTROLLERS                   │   │   │
│   │  │  AuthController | DealController | Admin   │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │   
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │            SERVICE LAYER                    │   │   │
│   │  │  Business Logic | Validation | Transactions │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   │                                                     │   │
│   │  ┌─────────────────────────────────────────────┐   │   │
│   │  │           REPOSITORY LAYER                  │   │   │
│   │  │        Spring Data JPA (Hibernate)          │   │   │
│   │  └─────────────────────────────────────────────┘   │   │
│   └───────────────────────────┬─────────────────────────┘   │
│                               │ JDBC                         │
└───────────────────────────────┼─────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────┐n│                    DATA LAYER                               │
│                    MySQL DATABASE                           │
├─────────────────────────────────────────────────────────────┤
│   USERS (id, username, password, role)                      │
│   DEALS (id, client_name, stage, value)                     │
│   NOTES (id, deal_id, user_id, note)                        │
└─────────────────────────────────────────────────────────────┘
```

### 🔹 Architectural Characteristics

* **Client–Server Separation** for clear responsibility boundaries
* **SPA Frontend** for faster UI interactions
* **Stateless Backend** using JWT authentication
* **Role-Based Access Control (RBAC)** for sensitive deal data
* **Layered Backend Design** (Controller → Service → Repository)
* **Relational Database** ensuring data integrity

---

## 🔐 Security Integration

* JWT-based authentication
* Token stored securely in browser storage
* HTTP Interceptor automatically attaches JWT to API requests
* Route Guards enforce role-based access

---

## 🔄 Application Flow (Frontend Perspective)

1. User accesses the application via browser
2. Login form submits credentials to backend
3. JWT token is received and stored
4. Protected routes are enabled post-authentication
5. Deals are fetched and displayed based on user role
6. All subsequent API calls include JWT in the Authorization header

---

## 🚀 Development Server

To start a local development server:

```bash
ng serve
```

Navigate to:

```
http://localhost:4200/
```

The application will automatically reload on source file changes.

---

## 🛠️ Code Scaffolding

Generate new components, services, or modules using Angular CLI:

```bash
ng generate component component-name
```

For all available schematics:

```bash
ng generate --help
```

---

## 📦 Build

To build the project:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory. Production builds are optimized for performance.

---

## 🧪 Testing

### Unit Tests

```bash
ng test
```

Runs unit tests using **Karma** test runner.

### End-to-End Tests

```bash
ng e2e
```

You may configure your preferred E2E testing framework (e.g., Cypress, Playwright).

---

## 🔗 Backend Dependency

This frontend communicates with a **Spring Boot backend** running on:

```
http://localhost:8080
```

Ensure the backend is running and CORS is properly configured before starting the frontend.

---

## 📚 Additional Resources

* [Angular CLI Overview](https://angular.dev/tools/cli)
* [Angular Material](https://material.angular.io/)
* [Angular Security Best Practices](https://angular.dev/guide/security)

---

## 📄 Project Name Variants

* `Investment_Banking_Frontend`
* `Investment_Banking_Frontendd`

---

## imp login credientials
Admin Accounts:
1. Username: admin       Password: admin123
2. Username: bob.wilson  Password: password

User Accounts:
1. Username: john.doe    Password: user123
2. Username: jane.smith  Password: password

### ✨ This frontend is designed to provide a clean, secure, and scalable user experience for modern investment banking deal management.
