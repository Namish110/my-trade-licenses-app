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

  getUserRole(): string {
    const token = this.tokenService.getToken();
    if (!token) return '';

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role; // must match backend claim
  }

  logout() {
    this.tokenService.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}
