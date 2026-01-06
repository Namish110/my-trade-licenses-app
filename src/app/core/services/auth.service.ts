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
    return this.api.post<any>('/auth/login', payload).pipe(
      tap(res => {
        this.tokenService.setToken(res.token); // 👈 backend JWT
      })
    );
  }

  logout() {
    this.tokenService.clear();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}
