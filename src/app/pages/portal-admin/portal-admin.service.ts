import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PortalAdminModel } from '../../core/models/portal-admin.model';

@Injectable({
  providedIn: 'root'
})
export class PortalAdminService {

  private baseUrl = 'https://localhost:7181/api'; // 👈 change to your backend
  //https://localhost:7181/api/dashboard/application-status-count
  constructor(private http: HttpClient) {}

  //#region Getting data to load in dashboard
  getApplicationStatusCount(portalAdminId: number) {
    return this.http.get<any>(
      `${this.baseUrl}/dashboard/application-status-count/${portalAdminId}`
    );
  }
  //#endregion
  
  get<T>(url: string) {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }
  
  getAdminStatusCount(url: string) {
    return this.http.get<PortalAdminModel[]>(`${this.baseUrl}${url}`);
  }

  getAdminApplications(params: {
    zoneId?: number | null;
    mohId?: number | null;
    wardId?: number | null;
    licenceApplicationId?: number | null;
    applicationNumber?: string | null;
    pageNumber?: number;
    pageSize?: number;
  }) {
    let httpParams = new HttpParams()
      .set('pageNumber', (params.pageNumber ?? 1).toString())
      .set('pageSize', (params.pageSize ?? 10).toString());

    if (params.zoneId) httpParams = httpParams.set('zoneId', params.zoneId.toString());
    if (params.mohId) httpParams = httpParams.set('mohId', params.mohId.toString());
    if (params.wardId) httpParams = httpParams.set('wardId', params.wardId.toString());
    if (params.licenceApplicationId) {
      httpParams = httpParams.set(
        'licenceApplicationId',
        params.licenceApplicationId.toString()
      );
    }
    if (params.applicationNumber) {
      httpParams = httpParams.set('applicationNumber', params.applicationNumber);
    }

    return this.http.get<any>(
      `${this.baseUrl}/trade-licence/admin/applications`,
      { params: httpParams }
    );
  }
}
