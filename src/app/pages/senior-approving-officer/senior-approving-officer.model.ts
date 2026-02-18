export interface SeniorApprovedApplications {
  role?: string;
  Role?: string;
  status?: string;
  Status?: string;
  visibleStatuses?: string[];
  VisibleStatuses?: string[];
  loginID?: number;
  LoginID?: number;
  totalRecords?: number;
  TotalRecords?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
  data?: InspectionSubmittedApplication[];
  Data?: InspectionSubmittedApplication[];
}

export interface SeniorApproverDashboardResponse {
  role?: string;
  Role?: string;
  loginID?: number;
  LoginID?: number;
  dashboard?: {
    TotalForwarded?: number;
    totalForwarded?: number;
    TotalObjection?: number;
    totalObjection?: number;
    TotalApproved?: number;
    totalApproved?: number;
    TotalRejected?: number;
    totalRejected?: number;
    GrandTotal?: number;
    grandTotal?: number;
  };
  Dashboard?: {
    TotalForwarded?: number;
    totalForwarded?: number;
    TotalObjection?: number;
    totalObjection?: number;
    TotalApproved?: number;
    totalApproved?: number;
    TotalRejected?: number;
    totalRejected?: number;
    GrandTotal?: number;
    grandTotal?: number;
  };
}

export interface InspectionSubmittedApplication {
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
}
