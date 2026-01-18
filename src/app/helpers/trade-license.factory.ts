import { TradeLicenseApplication, TradeLicenseApplicationDetails } from "../core/models/new-trade-licenses.model";

//Helper Methods
  export function initializeApplicationDetails(): TradeLicenseApplicationDetails {
    return {
      applicantName: '',
      doorNumber: '',
      address1: '',
      address2: '',
      address3: '',
      pincode: '',
      landLineNumber: '',
      mobileNumber: '',
      emailID: '',
      tradeName: '',
      zonalClassificationID: 0,
      mohID: 0,
      wardID: 0,
      propertyID: 0,
      pidNumber: '',
      khathaNumber: '',
      surveyNumber: '',
      street: '',
      gisNumber: '',
      licenceNumber: '',
      licenceCommencementDate: new Date(),
      licenceStatusID: 0,
      oldapplicationNumber: '',
      newlicenceNumber: ''
    };
  }

  export function initializeTradeApplication(): TradeLicenseApplication {
    return {
      licenceApplicationID: 0,
      newApplicationNumber: '',
      finanicalYearID: 0,
      tradeTypeID: 0,
      bescomRRNumber: '',
      tinNumber: '',
      vatNumber: '',
      licenceFromDate: null as any,
      licenceToDate: null as any,
      licenceApplicationStatusID: 0,
      currentStatus: 0,
      tradeLicenceID: 0,
      mohID: 0,
      loginID: 0,
      entryOriginLoginID: 0,
      inspectingOfficerID: 0,
      licenseType: '',
      applicantRepersenting: 0,
      jathaStatus: '',
      docsSubmitted: false,
      challanNo: '',
      noOfYearsApplied: 0
    };
  }