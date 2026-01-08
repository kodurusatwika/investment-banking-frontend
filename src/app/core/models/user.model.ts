export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  role: Role;
}