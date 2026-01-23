import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeLicenseApplication } from '../../core/models/new-trade-licenses.model';
import { PaginatedResponse } from '../../core/models/trade-licenses-details.model';

@Injectable({
  providedIn: 'root'
})
export class TradeLicensesService {

  private baseUrl = 'https://localhost:7181/api'; // 👈 change to your backend

  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }

  getAppliedLicensesApplications(loginId: number, pageNumber: number, pageSize: number) {
    return this.get<PaginatedResponse<TradeLicenseApplication>>(
      `/licence-application/by-temp-login/${loginId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}