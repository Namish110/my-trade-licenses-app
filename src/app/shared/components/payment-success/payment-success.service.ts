import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentSuccessService {

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

  saveApplicationToTradeLicense(licensesApplicationNumber: number) {
    return this.http.post(
        `${this.baseUrl}/trade-licence/${licensesApplicationNumber}/submit`,
        {}
    );
  }


  saveApplicationToLicensesApp(licensesApplicationNumber: number) {
    return this.http.post(
        `${this.baseUrl}/licence-application/submit/${licensesApplicationNumber}`,
        {}
    );
  }

  saveApplicationToTradeLicenseWithPayment(licensesApplicationNumber: number) {
    return this.http.post(
        `${this.baseUrl}/licence-application/payment-success/${licensesApplicationNumber}`, {}
    );
  }
}