import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradeType } from '../../core/models/new-trade-licenses.model';
import { LicenceApplicationModel, TradeLicensesApplicationDetails } from '../../core/models/trade-licenses-details.model';

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
    return this.http.get<any>(`${this.baseUrl}/geolocation/get/${licenceApplicationID}`);
  }

  getTradeTypeById(tradeTypeId: number){
    //return this.http.put<any>(`${this.baseUrl}/trade-type/${tradeTypeId}`);
  }
  //Documents for inspection
}