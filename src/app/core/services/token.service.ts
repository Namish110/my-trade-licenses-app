import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private TOKEN_KEY = 'access_token';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // 🔥 Decode JWT
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  // 🔥 Get UserId as NUMBER
  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub ? Number(decoded.sub) : null;
  }

  getRole(): string {
    const decoded: any = this.getDecodedToken();
    return decoded?.unique_name ?? '';
  }
}
