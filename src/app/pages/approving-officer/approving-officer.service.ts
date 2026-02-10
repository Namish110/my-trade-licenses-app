import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeType } from '../../core/models/new-trade-licenses.model';
import { AllApprovedApplication, ApprovedApplications, LicenceApplicationModel } from '../../core/models/trade-licenses-details.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovingOfficerService {

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

  getTradeTypes(){
    return this.get<TradeType[]>('/trade-type');
  }

  getPagedApplications(pageNumber: number, pageSize: number) {
    return this.http.get<{
      data: LicenceApplicationModel[];
      totalRecords: number;
      totalPages: number;
    }>(
      `${this.baseUrl}/licence-application/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getAppliedApproverApplications(
    loginId: number,
    pageNumber: number,
    pageSize: number
  ) {
    return this.http.get<ApprovedApplications>(
      `${this.baseUrl}/trade-licence/approver/applications?loginId=${loginId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  //trade-licence/search?text//&pageNumber=${pageNumber}&pageSize=${pageSize}
  searchApplications(searchText: string) {
    return this.http.get<ApprovedApplications>(
      `${this.baseUrl}/trade-licence/search?text=${searchText}`
    );
  }

}