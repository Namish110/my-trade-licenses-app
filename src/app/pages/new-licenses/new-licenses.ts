import { Component, AfterViewInit, Inject, PLATFORM_ID, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NewLicensesService } from './new-licenses.service';
import { TradeMajor, TradeMinor, TradeSub, TradeType, Ward, TradeLicenseApplication, TradeLicenseApplicationDetails, AssemblyConstituency, Zones, ZoneClassification, MLCConstituency } from '../../core/models/new-trade-licenses.model';
import { initializeApplicationDetails, initializeTradeApplication } from '../../helpers/trade-license.factory';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';


/* =========================
   FIX LEAFLET ICON ISSUE
========================= */
interface TradeGridItem {
  major: any;
  minor: string;
  sub: string;
  rate: number;
}

@Component({
  selector: 'app-new-licenses',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-licenses.html',
  styleUrl: './new-licenses.css',
})
export class NewLicenses {
  //Stepper Logic
  currentStep = 0; // 0 = Declaration
  agree = false;

  infoAboutIssueRelated: any = 'For any issue related to online payments mail us to "bbmptl@gmail.com" with all transaction detail like transaction id, date of transaction, old license number.';
  infoAboutRules1: any = 'I/We do hereby affirm and state that the information to be furnished by me/us in the trade license new or renewal application are true and correct to the best of my/our knowledge and belief.';
  infoAboutRules2: any = 'I/We further declare that I/We am/are aware that the trade license application is specifically for the Trade for which it is to be issued and does not regularize unauthorized constructions, or violations of building by laws and regulations and that I/We may be prosecuted for such infringments even through I/We have obtained a trade license under the act.';
  infoAboutRules3: any = 'I/We further understand that the Trade license may be suspended or cancelled in the event it is found that the business is being run in the premises that violating existing rules and zonal regulation as per the Comprehensive Development Plan 2015 issued by Bangalore Development Authority.';
  infoAboutRules4: any = 'I/We further undertake to have no objection in the authorities revoking the trade license in case there is any discrepancies,disputes,defects or false information in any documentation that is submitted by me/us as stated in the application form.';
  infoAboutRules5: any = 'I/We undertake that I/We will not employ/engage child labour for the purpose of carrying the trade.';
  infoAboutRules6: any = 'I/We declare that incase of any objections/Complaints raised by immediate neighbors,I/We shall furnish all the documents and take corrective action as per the KMC act.';

  //Creating a trade major list 
  tradeMajors : TradeMajor[] = [];
  tradeMinors : TradeMinor[] = [];
  tradeSubs : TradeSub[] = [];
  tradeTypes : TradeType[] = [];
  mlaConstituencies : MLCConstituency[] = [];
  wards : Ward[] = [];
  zones : Zones[] = [];
  zoneClassifications : ZoneClassification[] = [];
  tradeLicenseApplicationDetails : TradeLicenseApplicationDetails = {
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
  tradeLicenseApplications : TradeLicenseApplication ={
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
  }

  selectedMajor: TradeMajor | null = null;
  selectedMinor: TradeMinor | null = null;
  selectedSub: TradeSub | null = null;
  selectedTradeType: TradeType | null = null;
  selectedMLAConstituency: MLCConstituency | null = null;
  selectedWard: Ward | null = null;
  selectedZone: Zones | null = null;
  selectedZoneClassification: ZoneClassification | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private newLicensesService: NewLicensesService, 
  private router: Router,
  private tokenservice : TokenService) {}

  startApplication() {
    this.currentStep = 1;
  }

  nextStep() {
    if(this.currentStep === 1){
    // 1. Applicant Representation (radio)
    const repSelected = document.querySelector('input[name="rep"]:checked');
    if (!repSelected) {
      alert('Please select Applicant Representation');
      return;
    }
    // 2. Trade Type
    if (!this.selectedTradeType) {
      alert('Please select Trade Type');
      return;
    }

    // 3. Trade Name
    const tradeName = (document.querySelector('#tradeName') as HTMLInputElement)?.value;
    if (!tradeName) {
      alert('Please enter Trade Name');
      return;
    }

    // 4. Application Name
    const applicationName = (document.querySelector('#applicationName') as HTMLInputElement)?.value;
    if (!applicationName) {
      alert('Please enter Application Name');
      return;
    }

    // 5. Mobile Number
    const mobile = this.tradeLicenseApplicationDetails.mobileNumber;
    if (!mobile || mobile.length !== 10) {
      alert('Please enter valid 10-digit Mobile Number');
      return;
    }

    // 6. MLA Constituency
    if (!this.selectedMLAConstituency) {
      alert('Please select MLA Constituency');
      return;
    }

    // 7. Ward
    if (!this.selectedWard) {
      alert('Please select Ward');
      return;
    }

    // 8. BESCOM RR No
    const bescom = (document.querySelector('#bescom') as HTMLInputElement)?.value;
    if (!bescom) {
      alert('Please enter BESCOM RR Number');
      return;
    }

    // 9. Address fields
    const doorNo = (document.querySelector('#doorNo') as HTMLInputElement)?.value;
    const street = (document.querySelector('#street') as HTMLInputElement)?.value;
    const area = (document.querySelector('#area') as HTMLInputElement)?.value;
    const pincode = (document.querySelector('#pincode') as HTMLInputElement)?.value;

    if (!doorNo || !street || !area || !pincode) {
      alert('Please fill complete Address Information');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert('Please enter valid 6-digit Pincode');
      return;
    }
  }
  /*=========================
    STEP 2 VALIDATION
  ========================= */
  if (this.currentStep === 2) {

    // 1. Major Trade
    if (!this.selectedMajor) {
      alert('Please select Major Trade');
      return;
    }

    // 2. Minor Trade
    if (!this.selectedMinor) {
      alert('Please select Minor Trade');
      return;
    }

    // 3. Sub Trade
    if (!this.selectedSub) {
      alert('Please select Sub Trade');
      return;
    }

    // 4. Trade Grid (at least one trade must be added)
    if (!this.tradeGrid || this.tradeGrid.length === 0) {
      alert('Please add at least one Trade using Add button');
      return;
    }
  }

  /* =========================
    STEP 3 VALIDATION
    ========================= */
    if (this.currentStep === 3) {

      // 1. Jurisdiction Zone
      if (!this.selectedZone) {
        alert('Please select Jurisdiction of Health Officer (Zone)');
        return;
      }

      // 2. Zone Classification
      if (!this.selectedZoneClassification) {
        alert('Please select Zone Classification');
        return;
      }

      // 3. License Fee check
      if (!this.licenseFee || this.licenseFee <= 0) {
        alert('License Fee is not calculated. Please check trade details.');
        return;
      }
    }

    /* =========================
      STEP 5 VALIDATION
    ========================= */
    if (this.currentStep === 5) {

      // 1. Owner Consent
      if (!this.documents?.ownerConsent) {
        alert('Please upload Owner Consent / Lease Agreement document');
        return;
      }

      // 2. Electricity Bill
      if (!this.documents?.electricityBill) {
        alert('Please upload Electricity Bill document');
        return;
      }

      // 3. Neighbour Consent
      if (!this.documents?.neighbour) {
        alert('Please upload Neighbour Consent document');
        return;
      }

      // 4. Power / Generator check (optional but safe)
      if (
        (this.powerHP && this.powerHP < 0) ||
        (this.generatorHP && this.generatorHP < 0)
      ) {
        alert('Power / Generator HP cannot be negative');
        return;
      }

      // Optional sanity check
      if (this.powerFee < 0) {
        alert('Power fee calculation error');
        return;
      }
    }

    if (this.currentStep < 7) {
      this.currentStep++;

      // Map init only when location step loads
      if (this.currentStep === 4) {
        setTimeout(() => {
          this.initMap();
          this.map.invalidateSize();
        }, 300);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /* =========================
     APPLICANT
  ========================= */
  representations = [
    'Proprietor',
    'Partner',
    'Director',
    'Authorized Signatory'
  ];

  tradeGrid: TradeGridItem[] = [];

  /* =========================
     DATE / ZONE / FEE
  ========================= */
  applicationDate = new Date().toISOString().substring(0, 10);
  commencementDate = '';

  bindCommencementDate() {
    if (this.commencementDate) {
      this.tradeLicenseApplications.licenceToDate =
        new Date(this.commencementDate);
    }
  }
  zone = '';

  licenseFee = 0;

  get totalAmount(): number {
    return this.tradeGrid.reduce((sum, t) => sum + t.rate, 0);
  }

  /* =========================
     TRADE GRID
  ========================= */
  addTrade() {
    if (!this.selectedMajor || !this.selectedMinor || !this.selectedSub) {
      alert('Please select Major, Minor and Sub Trade');
      return;
    }

    this.tradeGrid.push({
      major: this.selectedMajor.tradeMajorName,
      minor: this.selectedMinor.tradeMinorName,
      sub: this.selectedSub.tradeSubName,
      rate: 500, // Fixed rate for demo purposes
    });

    this.calculateFee();
  }

  removeTrade(index: number) {
    this.tradeGrid.splice(index, 1);
    this.calculateFee();
  }

  /* =========================
     POWER / GENERATOR
  ========================= */
  powerHP = 0;
  generatorHP = 0;
  powerFee = 0;

  calculateFee() {
    this.powerFee = Math.max(this.powerHP, this.generatorHP) * 100;
    this.licenseFee = this.totalAmount + this.powerFee + 500; 
  }

  /* =========================
     DOCUMENT UPLOAD
  ========================= */
  documents: any = {};

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }


    this.documents[key] = file;
  }

  /* =========================
     OTP LOGIC (MOCK)
  ========================= */
  otp = '';
  otpSent = false;
  otpVerified = false;

  sendOtp() {
    if (!this.tradeLicenseApplicationDetails.mobileNumber || this.tradeLicenseApplicationDetails.mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    this.newLicensesService.sendotp(this.tradeLicenseApplicationDetails.mobileNumber).subscribe({
      next: () => {
        this.otpSent = true;
        alert('OTP sent successfully');
      },
      error: () => {
        alert('Failed to send OTP');
      }
    });
  }

  verifyOtp() {
    if (this.otp === '1234') {
      this.otpVerified = true;
      alert('OTP Verified');
    } else {
      alert('Invalid OTP');
    }
  }
//#region  Map Logic starts here
  /* =========================
     MAP + LOCATION SEARCH
  ========================= */
  latitude: number | null = null;
  longitude: number | null = null;
  //For Road width
  roadWidth: number | null = null;
  roadWidthSource = '';
  roadWidthStatus = '';

  //For map
  private L: any;
  map: any;
  marker: any;

  searchText = '';
  searchResults: any[] = [];

  //ngAfterViewInit(): void {}

  initMap() {
    if (!this.L || this.map) return;

    this.map = this.L.map('map', {
      center: [12.9716, 77.5946],
      zoom: 11
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const leaflet = await import('leaflet');
      this.L = leaflet;

      delete (this.L.Icon.Default.prototype as any)._getIconUrl;

      this.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'marker-icon-2x.png',
        iconUrl: 'marker-icon.png',
        shadowUrl: 'marker-shadow.png'
      });
    }
  }

  setMarker(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = this.L.marker([lat, lng], {
        draggable: true
      }).addTo(this.map);

      this.marker.on('dragend', (event: any) => {
        const pos = event.target.getLatLng();
        this.latitude = pos.lat;
        this.longitude = pos.lng;

        if (this.latitude !== null && this.longitude !== null) {
          this.fetchRoadWidth(this.latitude, this.longitude);
        }
      });
    }
    // if (this.latitude !== null && this.longitude !== null) {
    //   this.fetchRoadWidth(this.latitude, this.longitude);
    // }
  }


  //RoadWidth
  fetchRoadWidth(lat: number, lng: number) {
    this.newLicensesService.getRoadWidth(lat, lng).subscribe({
      next: res => {
        this.roadWidth = res.roadWidth;
        this.roadWidthSource = res.source;
        this.roadWidthStatus = res.complianceStatus;
      },
      error: () => {
        this.roadWidth = null;
        this.roadWidthStatus = 'Unable to fetch road width';
      }
    });
  }


  /* =========================
     LOCATION SEARCH (NOMINATIM)
  ========================= */
  searchLocation() {
    if (this.searchText.length < 3) {
      this.searchResults = [];
      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${this.searchText}&countrycodes=in&limit=5`
    )
      .then(res => res.json())
      .then(data => this.searchResults = data);
  }

  selectLocation(place: any) {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    this.searchText = place.display_name;
    this.searchResults = [];

    this.map.setView([lat, lon], 16);
    this.setMarker(lat, lon);
  }
//#endregion

  //PageLoadMethod
  ngOnInit(): void {
    this.loadTradeMajors();
    this.loadTradeType();
    this.loadMLAConstituencies();
    this.loadZones();
    this.loadZoneClassification();
    this.tradeLicenseApplicationDetails = initializeApplicationDetails();
    this.tradeLicenseApplications = initializeTradeApplication();
    this.tradeLicenseApplications.licenceFromDate = new Date(this.applicationDate);
  }

  //#region  Dropdown Methods
  //Major dropdown
  loadTradeMajors() {
    this.newLicensesService.getTradeMajors().subscribe({
      next: (res) => {
        this.tradeMajors = res;
      },
      error: (err) => console.error(err)
    });
  }

  //When major changes
  onMajorChange() {
    this.selectedMinor = null;
    this.selectedSub = null;
    this.tradeSubs = [];

    if (!this.selectedMajor) return;

    this.newLicensesService
      .getTradeMinorsByMajor(this.selectedMajor.tradeMajorID)
      .subscribe({
        next: (res) => {
          this.tradeMinors = res;
        },
        error: (err) => console.error(err)
      });
  }

  //When minor changes
  onMinorChange() {
    this.selectedSub = null;

    if (!this.selectedMinor) return;

    this.newLicensesService
      .getTradeSubsByMinor(this.selectedMinor.tradeMinorID)
      .subscribe({
        next: (res) => {
          this.tradeSubs = res;
        },
        error: (err) => console.error(err)
      });
  }

  //Load Trade Types
  loadTradeType(){
    this.newLicensesService.getTradeTypes().subscribe({
      next: (res) => {
        this.tradeTypes = res;
      },
      error: (err) => console.error(err)
    });
  }

  //Load MLA Constituencies
  loadMLAConstituencies(){
    this.newLicensesService.getMLAConstituency().subscribe({
      next: (res) => {
        this.mlaConstituencies = res;
      },
      error: (err) => console.error(err)
    });
  }

  //When MLA Constituency changes
  onMLAConstituencyChange(){
    if(!this.selectedMLAConstituency) return;
    this.newLicensesService.getWardsByMLAConstituency(this.selectedMLAConstituency.constituencyID).subscribe({
      next: (res) => {
        this.wards = res;
      },
      error: (err) => console.error(err)
    });
  }
  
  //to load zones
  loadZones(){
    this.newLicensesService.getZones().subscribe({
      next: (res) => {
        this.zones = res;
      },
      error: (err) => console.error(err)
    });
  }

  //to load zonesclassification
  loadZoneClassification(){
    this.newLicensesService.getZoneClassification().subscribe({
      next: (res) => {
        this.zoneClassifications = res;
      },
      error: (err) => console.error(err)
    });
    
  }

  //#endregion


  saveAndPayLater() {
    const tradeLicencePayload = {
    applicantName: this.tradeLicenseApplicationDetails.applicantName,
    doorNumber: this.tradeLicenseApplicationDetails.doorNumber,
    address1: this.tradeLicenseApplicationDetails.address1,
    address2: this.tradeLicenseApplicationDetails.address2,
    address3: this.tradeLicenseApplicationDetails.address3,
    pincode: this.tradeLicenseApplicationDetails.pincode,
    landLineNumber: this.tradeLicenseApplicationDetails.landLineNumber,
    mobileNumber: this.tradeLicenseApplicationDetails.mobileNumber,
    emailID: this.tradeLicenseApplicationDetails.emailID,
    tradeName: this.tradeLicenseApplicationDetails.tradeName,

    zonalClassificationID: this.selectedZoneClassification ? this.selectedZoneClassification.zonalClassificationID : 0,
    mohID: this.selectedMLAConstituency ? this.selectedMLAConstituency.mohID : 0,
    wardID: this.selectedWard ? this.selectedWard.wardID : 0,

    propertyID: this.tradeLicenseApplicationDetails.propertyID,
    pidNumber: this.tradeLicenseApplicationDetails.pidNumber,
    khathaNumber: this.tradeLicenseApplicationDetails.khathaNumber,
    surveyNumber: this.tradeLicenseApplicationDetails.surveyNumber,
    street: this.tradeLicenseApplicationDetails.street,
    gisNumber: this.tradeLicenseApplicationDetails.gisNumber,

    licenceNumber: this.tradeLicenseApplicationDetails.licenceNumber,
    licenceCommencementDate: this.tradeLicenseApplicationDetails.licenceCommencementDate,
    licenceStatusID: 1, // Active

    oldapplicationNumber: this.tradeLicenseApplicationDetails.oldapplicationNumber,
    newlicenceNumber: this.tradeLicenseApplicationDetails.newlicenceNumber
  };
    // Step 1: Trade Licence Draft
  this.newLicensesService
    .post('/trade-licence', tradeLicencePayload)
    .subscribe({
      next: (res: any) => {

        // Attach TradeLicenceID
        const licenceApplicationDraftPayload = {
          finanicalYearID: this.tradeLicenseApplications.finanicalYearID,
          tradeTypeID: this.selectedTradeType ? this.selectedTradeType.tradeTypeID : 0,

          bescomRRNumber: this.tradeLicenseApplications.bescomRRNumber,
          tinNumber: this.tradeLicenseApplications.tinNumber,
          vatNumber: this.tradeLicenseApplications.vatNumber,

          licenceFromDate: this.tradeLicenseApplications.licenceFromDate,
          licenceToDate: this.tradeLicenseApplications.licenceToDate,

          tradeLicenceID: res.tradeLicenceID, // from API-1

          loginID: this.tokenservice.getUserId(),
          entryOriginLoginID: this.tradeLicenseApplications.entryOriginLoginID,
          inspectingOfficerID: this.tradeLicenseApplications.inspectingOfficerID,

          licenseType: this.tradeLicenseApplications.licenseType,
          applicantRepersenting: this.tradeLicenseApplications.applicantRepersenting,
          jathaStatus: this.tradeLicenseApplications.jathaStatus,
          mohID: this.selectedMLAConstituency ? this.selectedMLAConstituency.mohID : 0,
          docsSubmitted: this.tradeLicenseApplications.docsSubmitted,
          challanNo: this.tradeLicenseApplications.challanNo,
          noOfYearsApplied: this.tradeLicenseApplications.noOfYearsApplied
        };

        // Step 2: Licence Application Draft
        this.newLicensesService
          .post('/licence-application/draft', licenceApplicationDraftPayload)
          .subscribe({
            next: (draftRes: any) => {
              this.tradeLicenseApplications.licenceApplicationID =
                draftRes.licenceApplicationID;

              alert('Draft saved successfully. You can continue later.');
            },
            error: err => {
              console.error('Licence Application Draft failed', err);
              alert('Trade licence saved but application draft failed.');
            }
          });
      },
      error: err => {
        console.error('Trade Licence Draft failed', err);
        alert('Failed to save trade licence draft.');
      }
    });
  }
}