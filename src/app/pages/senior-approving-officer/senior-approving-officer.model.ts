export interface SeniorApprovedApplications {
  role: string;
  status: string;
  loginID: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: InspectionSubmittedApplication[];
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