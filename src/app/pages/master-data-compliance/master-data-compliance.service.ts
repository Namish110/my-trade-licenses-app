import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MLCConstituency, TradeMajor, TradeMinor, TradeSub, TradeType, Ward, ZoneClassification, Zones } from '../../core/models/new-trade-licenses.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataComplianceService {

  private baseUrl = 'https://pickitover.com/api/api/'; // 👈 change to your backend

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
  getTradeMajors() {
      return this.get<TradeMajor[]>('/master/trade-major');
    }
  
    getTradeMinorsByMajor(majorId: number) {
      return this.get<TradeMinor[]>(`/master/trade-minor/by-major/${majorId}`);
    }
  
    getTradeSubsByMinor(minorId: number) {
      return this.get<TradeSub[]>(`/master/trade-sub/by-minor/${minorId}`);
    }
  
    getTradeTypes(){
      return this.get<TradeType[]>('/trade-type');
    }
  
    getMLAConstituency(){
      return this.get<MLCConstituency[]>('/master-moh');
    }
  
    getWardsByMLAConstituency(mlaId: number) {
      return this.get<Ward[]>(`/bbmp-wards/by-constituency/${mlaId}`);
    }
  
    getZones(){
      return this.get<Zones[]>('/bbmp-zones');
    }
  
    getZoneClassification(){
      return this.get<ZoneClassification[]>('/trade-zonal-classification');
    }
}

