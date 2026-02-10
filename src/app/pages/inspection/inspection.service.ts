import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeType } from '../../core/models/new-trade-licenses.model';
import { ApprovedApplications, LicenceApplicationModel, TradeLicensesApplicationDetails } from '../../core/models/trade-licenses-details.model';
import { LocationDetails } from './inspection.model';

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

  getlicenceApplicationDetails(licenceApplicationID: number) {
    return this.http.get<LicenceApplicationModel>(`${this.baseUrl}/licence-application/${licenceApplicationID}`
    );
  }

  gettradelicenceApplicationDetails(tradelicenceApplicationID: number) {
    return this.http.get<TradeLicensesApplicationDetails>(`${this.baseUrl}/trade-licence/${tradelicenceApplicationID}`
    );
  }

  getgeolocationByLicensesAppId(licenceApplicationID: number){
    return this.http.get<LocationDetails>(`${this.baseUrl}/geolocation/get/${licenceApplicationID}`);
  }

  getTradeTypeById(tradeTypeId: number){
    //return this.http.put<any>(`${this.baseUrl}/trade-type/${tradeTypeId}`);
  }

  getAppliedApproverApplications(
    loginId: number,
    licenceApplicationId: number,
    pageNumber: number,
    pageSize: number
  ) {
    return this.http.get<ApprovedApplications>(
      `${this.baseUrl}/trade-licence/approver/applications?loginId=${loginId}&licenceApplicationId=${licenceApplicationId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getSeniorApproverApplications(
    loginId: number,
    licenceApplicationId: number,
    pageNumber: number,
    pageSize: number
  ) {
    return this.http.get<ApprovedApplications>(
      `${this.baseUrl}/trade-licence/senior-approver/applications?loginId=${loginId}&licenceApplicationId=${licenceApplicationId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
  //Documents for inspection

  submitLicenceProcessAction(body: {
    licenceApplicationID: number;
    loginID: number;
    licenceProcessID: number;
    currentStatus: string;
    currentStatusID?: number;
    remarks: string;
    actionReasonIds: string;
  }) {
    return this.http.post(
      `${this.baseUrl}/master/licence-process/submit-action`,
      body
    );
  }

  getLicenceProcessTimeline(licenceApplicationID: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/master/licence-process/application/${licenceApplicationID}/timeline`
    );
  }
}
