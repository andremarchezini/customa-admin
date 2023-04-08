import { Injectable } from '@angular/core';
export const STORAGE_TOKEN = 'token';

@Injectable()
export class AuthenticationService {
  token: string | null = null;

  constructor() {}

  setToken(token: string | null) {
    if (token === null) {
      localStorage.removeItem(STORAGE_TOKEN);
    } else {
      localStorage.setItem(STORAGE_TOKEN, token);
    }
    this.token = token;
  }

  getToken(): string | null {
    if (this.token !== undefined && this.token !== null) {
      return this.token;
    }
    const token = localStorage.getItem(STORAGE_TOKEN);
    this.token = token;
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
