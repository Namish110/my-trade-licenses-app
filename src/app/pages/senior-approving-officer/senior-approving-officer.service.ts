import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeniorApprovedApplications } from './senior-approving-officer.model';

@Injectable({
  providedIn: 'root'
})
export class SeniorApprovingOfficerService {

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

  getSubmittedInspectionApplications(loginId: number, pageNumber: number, pageSize: number) {
    return this.http.get<SeniorApprovedApplications>(`${this.baseUrl}/trade-licence/senior-approver/applications?loginId=${loginId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
}