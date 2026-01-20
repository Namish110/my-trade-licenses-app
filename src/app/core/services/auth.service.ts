import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private api: ApiService,
    private tokenService: TokenService
  ) {}

  login(payload: any) {
    return this.api.post<any>('/Auth/login', payload).pipe(
      tap(res => {
        this.tokenService.setToken(res.accessToken); // JWT token
      })
    );
  }
  // For user login
  userlogin(payload: any) {
    return this.api.post<any>('/Auth/login-USER', payload).pipe(
      tap(res => {
        this.tokenService.setToken(res.accessToken); // JWT token
      })
    );
  }
  getUserRole(): string {
    const token = this.tokenService.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }

  getUserloginRole(): string {
    const token = this.tokenService.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.designation ;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
