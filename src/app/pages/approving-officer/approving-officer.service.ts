import { HttpClient, HttpParams } from '@angular/common/http';
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
    pageSize: number,
    filters?: {
      mohId?: number | null;
      wardId?: number | null;
      licenceApplicationId?: number | null;
      applicationNumber?: string | null;
    }
  ) {
    let params = new HttpParams()
      .set('loginId', loginId.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filters?.mohId) {
      params = params.set('mohId', filters.mohId.toString());
    }
    if (filters?.wardId) {
      params = params.set('wardId', filters.wardId.toString());
    }
    if (filters?.licenceApplicationId) {
      params = params.set('licenceApplicationId', filters.licenceApplicationId.toString());
    }
    if (filters?.applicationNumber?.trim()) {
      params = params.set('applicationNumber', filters.applicationNumber.trim());
    }

    return this.http.get<ApprovedApplications>(`${this.baseUrl}/trade-licence/approver/applications`, { params });
  }

  getApproverLookup(loginId: number) {
    const params = new HttpParams().set('loginId', loginId.toString());
    return this.http.get<{
      role?: string;
      mode?: string;
      loginID?: number;
      zones?: Array<{ ZoneID?: number; ZoneName?: string; zoneID?: number; zoneName?: string }>;
      wards?: Array<{ WardID?: number; WardName?: string; ZoneID?: number; zoneID?: number; wardID?: number; wardName?: string }>;
      Zones?: Array<{ ZoneID?: number; ZoneName?: string; zoneID?: number; zoneName?: string }>;
      Wards?: Array<{ WardID?: number; WardName?: string; ZoneID?: number; zoneID?: number; wardID?: number; wardName?: string }>;
    }>(`${this.baseUrl}/trade-licence/approver/lookup`, { params });
  }

  getApproverDashboard(loginId: number) {
    return this.http.get<{
      role?: string;
      mode?: string;
      loginID?: number;
      data?: {
        TotalApplied?: number;
        TotalObjection?: number;
        TotalRejected?: number;
        GrandTotal?: number;
        totalApplied?: number;
        totalObjection?: number;
        totalRejected?: number;
        grandTotal?: number;
      };
      Data?: {
        TotalApplied?: number;
        TotalObjection?: number;
        TotalRejected?: number;
        GrandTotal?: number;
        totalApplied?: number;
        totalObjection?: number;
        totalRejected?: number;
        grandTotal?: number;
      };
    }>(
      `${this.baseUrl}/trade-licence/approver/dashboard?loginId=${loginId}`
    );
  }

  //trade-licence/search?text//&pageNumber=${pageNumber}&pageSize=${pageSize}
  searchApplications(searchText: string) {
    return this.http.get<ApprovedApplications>(
      `${this.baseUrl}/trade-licence/search?text=${searchText}`
    );
  }

}
