import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ZoneApproverApplication {
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
  mohID: number;
  mohName: string;
  wardID: number;
  wardName: string;
  latitude: number | null;
  longitude: number | null;
  roadID: number | null;
  roadWidthMtrs: number | null;
  roadCategoryCode: string | null;
  roadCategory: string | null;
  isConfirmed: boolean;
  entryDate: string | null;
}

export interface ZoneApproverApplicationsResponse {
  role: string;
  visibleStatuses: string[];
  loginID: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: ZoneApproverApplication[];
}

@Injectable({
  providedIn: 'root'
})
export class ZoneApprovingOfficerService {
  private readonly baseUrl = 'https://localhost:7181/api';

  constructor(private readonly http: HttpClient) {}

  getZoneApproverApplications(loginId: number, pageNumber: number, pageSize: number) {
    return this.http.get<ZoneApproverApplicationsResponse>(
      `${this.baseUrl}/trade-licence/zone-approver/applications?loginId=${loginId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
