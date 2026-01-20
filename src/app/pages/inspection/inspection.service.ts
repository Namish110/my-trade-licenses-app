import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeType } from '../../core/models/new-trade-licenses.model';
import { TradeLicenceApplicationModel } from '../../core/models/trade-licenses-details.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

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

  getTradeLicensesApplication(licensesId: number) {
    return this.http.get<TradeLicenceApplicationModel>(`${this.baseUrl}/licence-application/${licensesId}`
    );
  }
}