import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MLCConstituency, Ward, Zones } from '../../core/models/new-trade-licenses.model';

export interface AdminApplication {
  licenceApplicationID: number;
  applicationNumber: string;
  applicationSubmitDate: string;
  licenceApplicationStatusID: number;
  licenceApplicationStatusName: string;
  tradeLicenceID: number;
  applicantName: string;
  tradeName: string;
  mobileNumber: string;
  emailID: string;
  zoneID: number;
  zoneName: string;
  mohID: number;
  mohName: string;
  wardID: number;
  wardName: string;
  loginID: number;
}

export interface AdminApplicationsResponse {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: AdminApplication[];
}

export interface AdminApplicationsQuery {
  zoneId?: number | null;
  mohId?: number | null;
  wardId?: number | null;
  licenceApplicationId?: number | null;
  applicationNumber?: string | null;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApplicationsService {
  private readonly baseUrl = 'https://localhost:7181/api';

  constructor(private readonly http: HttpClient) {}

  getAdminApplications(
    query: AdminApplicationsQuery
  ): Observable<AdminApplicationsResponse> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.zoneId) {
      params = params.set('zoneId', query.zoneId.toString());
    }
    if (query.mohId) {
      params = params.set('mohId', query.mohId.toString());
    }
    if (query.wardId) {
      params = params.set('wardId', query.wardId.toString());
    }
    if (query.licenceApplicationId) {
      params = params.set('licenceApplicationId', query.licenceApplicationId.toString());
    }
    if (query.applicationNumber?.trim()) {
      params = params.set('applicationNumber', query.applicationNumber.trim());
    }

    return this.http.get<AdminApplicationsResponse>(
      `${this.baseUrl}/trade-licence/admin/applications`,
      { params }
    );
  }

  getZones(): Observable<Zones[]> {
    return this.http.get<Zones[]>(`${this.baseUrl}/bbmp-zones`);
  }

  getMohs(): Observable<MLCConstituency[]> {
    return this.http.get<MLCConstituency[]>(`${this.baseUrl}/master-moh`);
  }

  getWardsByConstituency(constituencyId: number): Observable<Ward[]> {
    return this.http.get<Ward[]>(
      `${this.baseUrl}/bbmp-wards/by-constituency/${constituencyId}`
    );
  }
}
