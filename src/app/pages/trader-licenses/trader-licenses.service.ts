import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeLicenseApplication } from '../../core/models/new-trade-licenses.model';
import { AppliedLicensesResponse, LicenceApplicationDetails } from '../../core/models/trade-licenses-details.model';
import { Observable } from 'rxjs';

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

  getAppliedLicensesApplications(loginId: number): Observable<AppliedLicensesResponse> {
    return this.get<AppliedLicensesResponse>(
      `/trade-licence/user/${loginId}/applications`
    );
  }
}