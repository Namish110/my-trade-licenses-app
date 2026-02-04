import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zones } from '../../core/models/new-trade-licenses.model';

/* ======================================================
   MODELS (STRICT & BACKEND-ALIGNED)
====================================================== */

/** REQUEST BODY (POST / PUT) */
export interface LoginMasterRequest {
  login: string;
  password: string;
  zoneID: number;
  officeDetailsID: number;
  userDesignationID: number;
  sakalaDO_Code: string;
  mobileNo: string;
  updatedBy: number;
}

/** USER RECORD (GET / SEARCH RESPONSE ITEM) */
export interface LoginMaster {
  loginID: number;
  login: string;
  password: string;
  zoneID: number;
  officeDetailsID: number;
  userDesignationID: number;
  sakalaDO_Code: string;
  MobileNo: string;
  isActive: string;

  entryDate?: string;
  updatedDate?: string;
  updatedBy?: number;

  // joined fields (from API)
  officeName?: string;
  userDesignationName?: string;
}

/** PAGINATED RESPONSE (GET & SEARCH) */
export interface PagedResponse<T> {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: T[];
}

/** OFFICE DROPDOWN */
export interface OfficeDetail {
  officeID: number;
  officeName: string;
}

/** DESIGNATION DROPDOWN */
export interface UserDesignation {
  userDesignationId: number;
  userDesignationName: string;
  isActive: string;
}

/* ======================================================
   SERVICE
====================================================== */

@Injectable({
  providedIn: 'root'
})
export class UsersRolesService {

  /* ================= BASE URL ================= */

  private readonly baseUrl = 'https://localhost:7181/api';

  /* ================= ENDPOINTS ================= */

  private readonly loginMasterUrl = `${this.baseUrl}/login-master`;
  private readonly searchUrl = `${this.loginMasterUrl}/search`;
  private readonly officeUrl = `${this.baseUrl}/office-details/api/getall`;
  private readonly designationUrl =
    `${this.baseUrl}/office-details/api/get-all-user-designation`;
  private readonly zonesUrl = `${this.baseUrl}/bbmp-zones`;


  constructor(private http: HttpClient) {}

  /* ======================================================
     USERS – GET (PAGINATED)
     GET /api/login-master?pageNumber=1&pageSize=10
  ====================================================== */

  getUsers(
    pageNumber: number,
    pageSize: number
  ): Observable<PagedResponse<LoginMaster>> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<LoginMaster>>(
      this.loginMasterUrl,
      { params }
    );
  }

  /* ======================================================
     USERS – SEARCH (PAGINATED)
     GET /api/login-master/search?q=abc&pageNumber=1&pageSize=10
  ====================================================== */

  searchUsers(
    query: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PagedResponse<LoginMaster>> {

    const params = new HttpParams()
      .set('q', query)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<LoginMaster>>(
      this.searchUrl,
      { params }
    );
  }

  /* ======================================================
     USER – GET BY ID
     GET /api/login-master/{id}
  ====================================================== */

  getUserById(id: number): Observable<LoginMaster> {
    return this.http.get<LoginMaster>(
      `${this.loginMasterUrl}/${id}`
    );
  }

  /* ======================================================
     USER – INSERT
     POST /api/login-master
  ====================================================== */

  addUser(payload: LoginMasterRequest): Observable<any> {
    return this.http.post<any>(
      this.loginMasterUrl,
      payload
    );
  }

  /* ======================================================
     USER – UPDATE
     PUT /api/login-master/{id}
  ====================================================== */

  updateUser(
    id: number,
    payload: LoginMasterRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.loginMasterUrl}/${id}`,
      payload
    );
  }

  /* ======================================================
     USER – DELETE
     DELETE /api/login-master/{id}?updatedBy=1
  ====================================================== */

  deleteUser(
    id: number,
    updatedBy: number
  ): Observable<any> {

    const params = new HttpParams()
      .set('updatedBy', updatedBy.toString());

    return this.http.delete<any>(
      `${this.loginMasterUrl}/${id}`,
      { params }
    );
  }

  /* ======================================================
     DROPDOWNS
  ====================================================== */

  /** OFFICE DROPDOWN */
  getOfficeDetails(): Observable<OfficeDetail[]> {
    return this.http.get<OfficeDetail[]>(this.officeUrl);
  }

  /** USER DESIGNATION DROPDOWN */
  getUserDesignations(): Observable<UserDesignation[]> {
    return this.http.get<UserDesignation[]>(this.designationUrl);
  }

  //Get Zone Health Details
  getZones(){
    return this.http.get<Zones[]>(this.zonesUrl);
  }
}
