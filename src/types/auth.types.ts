// src/types/auth.types.ts

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserRecord extends User {
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}