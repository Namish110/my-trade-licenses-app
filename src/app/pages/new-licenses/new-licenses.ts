import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMap } from '@angular/google-maps';


import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { NewLicensesService } from './new-licenses.service';
import { TradeMajor, TradeMinor, TradeSub, TradeType, Ward, TradeLicenseApplication, TradeLicenseApplicationDetails, AssemblyConstituency, Zones, ZoneClassification, MLCConstituency, TradeLicensesFee, LicenseDocuments, RoadWidthDetails } from '../../core/models/new-trade-licenses.model';
import { initializeApplicationDetails, initializeTradeApplication } from '../../helpers/trade-license.factory';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { forkJoin, lastValueFrom } from 'rxjs';
import { LoaderService } from '../../shared/components/loader/loader.service';


/* =========================
   FIX LEAFLET ICON ISSUE
========================= */
interface TradeGridItem {
  major: any;
  minor: string;
  sub: string;
  rate: number;
}
declare const google: any;

@Component({
  selector: 'app-new-licenses',
  imports: [CommonModule, FormsModule, RouterModule, GoogleMapsModule   ],
  templateUrl: './new-licenses.html',
  styleUrl: './new-licenses.css',
  
  
})
export class NewLicenses {
  //Stepper Logic
  currentStep = 0; // 0 = Declaration
  agree = false;
 

@ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
@ViewChild(GoogleMap) googleMap!: GoogleMap;

map!: google.maps.Map;
drawingManager!: google.maps.drawing.DrawingManager;
selectedRectangle!: google.maps.Rectangle;


  infoAboutIssueRelated: any = 'For any issue related to online payments mail us to "bbmptl@gmail.com" with all transaction detail like transaction id, date of transaction, old license number.';
  infoAboutRules1: any = 'I/We do hereby affirm and state that the information to be furnished by me/us in the trade license new or renewal application are true and correct to the best of my/our knowledge and belief.';
  infoAboutRules2: any = 'I/We further declare that I/We am/are aware that the trade license application is specifically for the Trade for which it is to be issued and does not regularize unauthorized constructions, or violations of building by laws and regulations and that I/We may be prosecuted for such infringments even through I/We have obtained a trade license under the act.';
  infoAboutRules3: any = 'I/We further understand that the Trade license may be suspended or cancelled in the event it is found that the business is being run in the premises that violating existing rules and zonal regulation as per the Comprehensive Development Plan 2015 issued by Bangalore Development Authority.';
  infoAboutRules4: any = 'I/We further undertake to have no objection in the authorities revoking the trade license in case there is any discrepancies,disputes,defects or false information in any documentation that is submitted by me/us as stated in the application form.';
  infoAboutRules5: any = 'I/We undertake that I/We will not employ/engage child labour for the purpose of carrying the trade.';
  infoAboutRules6: any = 'I/We declare that incase of any objections/Complaints raised by immediate neighbors,I/We shall furnish all the documents and take corrective action as per the BBMP act.';

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
  tradeLicensesFee : TradeLicensesFee | null = null;

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
  private tokenservice : TokenService,
  private notificationservice: NotificationService,
  private loaderservice: LoaderService,
  private cdr: ChangeDetectorRef) {}


  // ================= GOOGLE MAP STATE =================

marker!: google.maps.Marker;

mapCenter: google.maps.LatLngLiteral = {
  lat: 12.9716,
  lng: 77.5946
};
mapZoom = 15;
getCurrentLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.mapCenter = {
        lat: this.latitude,
        lng: this.longitude
      };

      this.mapZoom = 18;

      // 🔥 Call your existing road-width logic
    this.fetchRoadWidth(this.longitude, this.latitude);

    },
    (error) => {
      alert('Location permission denied or unavailable');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
}
autoDetectCurrentLocation() {

  if (!isPlatformBrowser(this.platformId)) return;

  if (!navigator.geolocation) {
    this.notificationservice.show(
      'Geolocation is not supported by your browser',
      'warning'
    );
    return;
  }

  this.roadWidthStatus = 'Detecting current location...';
  this.notificationservice.show(
    'Detecting current location...',
    'info'
  );

  navigator.geolocation.getCurrentPosition(
    (position) => {

      // reuse existing logic
      this.setLocation(
        position.coords.latitude,
        position.coords.longitude
      );

    },
    () => {
      this.roadWidthStatus = 'Location permission denied';
      this.notificationservice.show(
        'Location permission denied. Please search manually.',
        'warning'
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
}

  startApplication() {
    this.currentStep = 1;
  }

  nextStep() {
    if(this.currentStep === 1){
    // 1. Applicant Representation (radio)
    const repSelected = document.querySelector('input[name="rep"]:checked');
    if (!repSelected) {
      this.notificationservice.show('Please select applicant representation', 'warning');
      return;
    }
    // 2. Trade Type
    if (!this.selectedTradeType) {
      this.notificationservice.show('Please select Trade Type','warning');
      return;
    }

    // 3. Trade Name
    const tradeName = (document.querySelector('#tradeName') as HTMLInputElement)?.value;
    if (!tradeName) {
      this.notificationservice.show('Please enter Trade Name', 'warning');
      return;
    }

    // 4. Application Name
    const applicationName = (document.querySelector('#applicationName') as HTMLInputElement)?.value;
    if (!applicationName) {
      this.notificationservice.show('Please enter Application Name', 'warning');
      return;
    }

    // 5. Mobile Number
    const mobile = this.tradeLicenseApplicationDetails.mobileNumber;
    if (!mobile || mobile.length !== 10) {
      this.notificationservice.show('Please enter valid 10-digit Mobile Number', 'warning');
      return;
    }

    // 6. MLA Constituency
    if (!this.selectedMLAConstituency) {
      this.notificationservice.show('Please select MLA Constituency', 'warning');
      return;
    }

    // 7. Ward
    if (!this.selectedWard) {
      this.notificationservice.show('Please select Ward', 'warning');
      return;
    }

    // 8. BESCOM RR No
    const bescom = (document.querySelector('#bescom') as HTMLInputElement)?.value;
    if (!bescom) {
      this.notificationservice.show('Please enter BESCOM RR Number', 'warning');
      return;
    }

    // 9. Address fields
    const doorNo = (document.querySelector('#doorNo') as HTMLInputElement)?.value;
    const street = (document.querySelector('#street') as HTMLInputElement)?.value;
    const area = (document.querySelector('#area') as HTMLInputElement)?.value;
    const pincode = (document.querySelector('#pincode') as HTMLInputElement)?.value;

    if (!doorNo || !street || !area || !pincode) {
      this.notificationservice.show('Please fill complete Address Information', 'warning');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      this.notificationservice.show('Please enter valid 6-digit Pincode', 'warning');
      return;
    }
  }
  /*=========================
    STEP 2 VALIDATION
  ========================= */
  if (this.currentStep === 2) {

    // 1. Major Trade
    if (!this.selectedMajor) {
      this.notificationservice.show('Please select Major Trade', 'warning');
      return;
    }

    // 2. Minor Trade
    if (!this.selectedMinor) {
      this.notificationservice.show('Please select Minor Trade', 'warning');
      return;
    }

    // 3. Sub Trade
    if (!this.selectedSub) {
      this.notificationservice.show('Please select Sub Trade', 'warning');
      return;
    }

    // 4. Trade Grid (at least one trade must be added)
    if (!this.tradeGrid || this.tradeGrid.length === 0) {
      this.notificationservice.show('Please add at least one Trade using Add button', 'warning');
      return;
    }
  }

  /* =========================
    STEP 3 VALIDATION
    ========================= */
    if (this.currentStep === 3) {

      // 1. Jurisdiction Zone
      if (!this.selectedZone) {
        this.notificationservice.show('Please select Jurisdiction of Health Officer (Zone)', 'warning');
        return;
      }

      // 2. Zone Classification
      if (!this.selectedZoneClassification) {
        this.notificationservice.show('Please select Zone Classification', 'warning');
        return;
      }

      // Proposed Commencement
      if(!this.commencementDate){
        this.notificationservice.show('Please select Proposed Conmmencement', 'warning');
        return;
      }

      // 3. License Fee check
      if (!this.licenseFee || this.licenseFee <= 0) {
        this.notificationservice.show('License Fee is not calculated. Please check trade details.', 'warning');
        return;
      }
    }

    /* ==========================
        STEP 4 VALIDATION
      =========================== */
     if (this.currentStep === 4) {

  if (this.roadWidthConfirmed === null) {
    this.notificationservice.show(
      'Please confirm the Road Width',
      'warning'
    );
    return;
  }

  if (this.roadWidthConfirmed === false) {
    if (!this.manualRoadWidth || this.manualRoadWidth <= 0) {
      this.notificationservice.show(
        'Please enter valid Road Width manually',
        'warning'
      );
      return;
    }

    // 🔥 Override API value
    if (this.roadWidthDetails) {
      this.roadWidthDetails.road_Width_mtrs = this.manualRoadWidth.toString();
    }
  }
}


    /* =========================
      STEP 5 VALIDATION
    ========================= */
    if (this.currentStep === 5) {

      // 1. Owner Consent
      if (!this.documents?.['ownerConsent']) {
        this.notificationservice.show('Please upload Owner Consent / Lease Agreement document', 'warning');
        return;
      }

      // 2. Electricity Bill
      if (!this.documents?.['electricityBill']) {
        this.notificationservice.show('Please upload Electricity Bill document', 'warning');
        return;
      }

      // 3. Neighbour Consent
      if (!this.documents?.['neighbour']) {
        this.notificationservice.show('Please upload Neighbour Consent document', 'warning');
        return;
      }

      // 4. Power / Generator check (optional but safe)
      if (
        (this.powerHP && this.powerHP < 0) ||
        (this.generatorHP && this.generatorHP < 0)
      ) {
        this.notificationservice.show('Power / Generator HP cannot be negative', 'warning');
        return;
      }

      // Optional sanity check
      if (this.powerFee < 0) {
        this.notificationservice.show('Power fee calculation error', 'warning');
        return;
      }
    }

    if (this.currentStep < 7) {
      this.currentStep++;

      // Map init only when location step loads
      if (this.currentStep === 4) {
        setTimeout(() => {
         this.initAutocomplete(); 
          this.autoDetectCurrentLocation(); 
        }, 300);
      }
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;

      if (this.currentStep === 4) {
        setTimeout(() => {
          this.initAutocomplete();
           this.autoDetectCurrentLocation(); 
        }, 300);
      }
    }
  }

  canProceedRoadWidth(): boolean {
    // Case 1: User confirmed road width from API
    if (this.roadWidthConfirmed === true) {
      return true;
    }

    // Case 2: User entered manual road width
    if (
      this.roadWidthConfirmed === false &&
      this.manualRoadWidth !== null &&
      this.manualRoadWidth > 0
    ) {
      return true;
    }

    return false;
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
    if (!this.commencementDate) {
      this.notificationservice.show(
        'Proposed Commencement Date is required',
        'warning'
      );
      return;
    }

    const selectedDate = new Date(this.commencementDate);
    const today = new Date();

    // Remove time part
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.notificationservice.show(
        'Proposed Commencement Date cannot be a past date',
        'warning'
      );
      this.commencementDate = '';
      return;
    }

    this.tradeLicenseApplications.licenceToDate = selectedDate;
  }

  zone = '';

  licenseFee = 0;

  get totalAmount(): number {
    return this.tradeGrid.reduce((sum, t) => sum + t.rate, 0);
  }

  /* =========================
     TRADE GRID
  ========================= */
  compareById(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.tradeSubID === o2.tradeSubID : o1 === o2;
  }

  addTrade() {
    if (!this.selectedMajor || !this.selectedMinor || !this.selectedSub) {
      this.notificationservice.show(
        'Please select Major, Minor and Sub Trade',
        'warning'
      );
      return;
    }

    this.newLicensesService
      .getLicensesFee(this.selectedSub.tradeSubID)
      .subscribe({
        next: (res) => {
          this.tradeGrid.push({
            major: this.selectedMajor!.tradeMajorName,
            minor: this.selectedMinor!.tradeMinorName,
            sub: this.selectedSub!.tradeSubName,
            rate: res.tradeLicenceFee ?? 0
          });

          this.calculateFee();
        },
        error: () => {
          this.notificationservice.show(
            'The amount could not be added. Please try again.',
            'warning'
          );
        }
      });
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
  documents: {
    [key: string]: {
      documentId: number;
      file: File;
    }
  } = {};

  onFileChange(event: any, key: string, documentId: number) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      this.notificationservice.show('Only PDF files allowed', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.notificationservice.show('File size must be less than 5MB', 'warning');
      return;
    }


    this.documents[key] = {
      documentId: documentId,
      file: file
    };
  }

  

  /* =========================
     OTP LOGIC (MOCK)
  ========================= */
  otp = '';
  otpSent = false;
  otpVerified = false;

  sendOtp() {
    if (!this.tradeLicenseApplicationDetails.mobileNumber || this.tradeLicenseApplicationDetails.mobileNumber.length !== 10) {
      this.notificationservice.show('Please enter a valid 10-digit mobile number', 'warning');
      return;
    }

    this.newLicensesService.sendOtp(this.tradeLicenseApplicationDetails.mobileNumber).subscribe({
      next: () => {
        this.otpSent = true;
        this.notificationservice.show('OTP sent successfully', 'success');
      },
      error: () => {
        this.notificationservice.show('Failed to send OTP', 'error');
      }
    });
  }

  verifyOtp(){
    this.verifyOtpAutomatically();
  }

  verifyOtpAutomatically() {
    this.newLicensesService
    .verifyOtp(this.tradeLicenseApplicationDetails.mobileNumber, this.otp)
    .subscribe({
      next: (res) => {
        if (res.isValid) {
          this.otpVerified = true; 
          this.notificationservice.show(
            'OTP is Verified.',
            'success'
          );
        } else {
          this.otpVerified = false;
          this.notificationservice.show(
            'Invalid OTP',
            'error'
          );
          this.otp = '';
        }
      },
      error: () => {
        this.otpVerified = false;
        alert('OTP verification failed');
      }
    });
  }

//#region  Map Logic starts here
  /* =========================
     MAP + LOCATION SEARCH
  ========================= */
  latitude: number | null = null;
  longitude: number | null = null;
  //For Road width




  roadWidthSource = '';
  roadWidthStatus = '';
  roadWidthDetails: RoadWidthDetails | null = null;
  



  searchText = '';
  searchResults: any[] = [];

  // Road width confirmation
  roadWidthConfirmed: boolean | null = null;
  manualRoadWidth: number | null = null;
  roadWidthReason = '';

  //ngAfterViewInit(): void {}
ngAfterViewInit(): void {
  setTimeout(() => {
    if (!this.googleMap?.googleMap) return;

    this.map = this.googleMap.googleMap;
    this.initDrawingTool();   // ✅ rectangle works now
  }, 500);
}



private initAutocomplete(): void {
  if (!this.searchInput?.nativeElement) return;

  if (!google?.maps?.places) {
    console.error('Google Places library not loaded');
    return;
  }

  const autocomplete = new google.maps.places.Autocomplete(
    this.searchInput.nativeElement,
    {
      componentRestrictions: { country: 'in' },
      fields: ['geometry', 'formatted_address']
    }
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    this.setLocation(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
}

private fillAddressFromLatLng(lat: number, lng: number): void {

  if (!google?.maps?.Geocoder || !this.searchInput?.nativeElement) return;

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode(
    { location: { lat, lng } },
    (
      results: google.maps.GeocoderResult[] | null,
      status: google.maps.GeocoderStatus
    ) => {

      if (
        status === google.maps.GeocoderStatus.OK &&
        results &&
        results.length > 0
      ) {
        // 🔥 Force Angular UI update
        this.searchInput.nativeElement.value =
          results[0].formatted_address;

        this.cdr.detectChanges(); // ✅ THIS FIXES IT
      }
    }
  );
}





setLocation(lat: number, lng: number): void {

  this.latitude = lat;
  this.longitude = lng;

  this.mapCenter = { lat, lng };

  // Marker logic
  if (this.map) {
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        draggable: true
      });

      this.marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          this.setLocation(e.latLng.lat(), e.latLng.lng());
        }
      });
    } else {
      this.marker.setPosition({ lat, lng });
    }
  }

  // ✅ NEW: Fill address into search box
  this.fillAddressFromLatLng(lat, lng);

  // Existing API call
  this.fetchRoadWidth(lng, lat);
}



onMapReady(): void {
  if (!this.googleMap) return;

  this.map = this.googleMap.googleMap!;
  this.initDrawingTool();
}

initDrawingTool(): void {
  if (!this.map) return;
  // Remove old drawing manager if exists
  if (this.drawingManager) {
    this.drawingManager.setMap(null);
  }

  this.drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.RECTANGLE, // 🔥 FORCE
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.RECTANGLE]
    },
    rectangleOptions: {
      fillColor: '#1976d2',
      fillOpacity: 0.25,
      strokeColor: '#1976d2',
      strokeWeight: 2,
      editable: true,
      draggable: true
    }
  });

  this.drawingManager.setMap(this.map);

  google.maps.event.addListener(
    this.drawingManager,
    'overlaycomplete',
    (event: google.maps.drawing.OverlayCompleteEvent) => {

      if (event.type !== google.maps.drawing.OverlayType.RECTANGLE) return;

      if (this.selectedRectangle) {
        this.selectedRectangle.setMap(null);
      }

      this.selectedRectangle = event.overlay as google.maps.Rectangle;

      const bounds = this.selectedRectangle.getBounds();
      if (!bounds) return;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      this.fetchRoadWidthByBox(ne, sw);

      // Stop drawing after one selection
      this.drawingManager.setDrawingMode(null);
    }
  );
}

fetchRoadWidthByBox(
  ne: google.maps.LatLng,
  sw: google.maps.LatLng
) {
  const payload = {
    licenceApplicationID: this.tokenservice.getTraderUserId(),
    northLat: ne.lat(),
    northLng: ne.lng(),
    southLat: sw.lat(),
    southLng: sw.lng()
  };

  this.newLicensesService.getRoadWidth(payload).subscribe({
    next: (res: RoadWidthDetails[]) => {
      this.roadWidthDetails = res?.[0] ?? null;
    },
    error: () => {
      this.roadWidthDetails = null;
    }
  });
}


onMapClick(event: google.maps.MapMouseEvent): void {
  if (!event.latLng) return;
  this.setLocation(event.latLng.lat(), event.latLng.lng());
}


  // private roundTo4Decimals(value: number): number {
  //   return Math.round(value * 10000) / 10000;
  // }

fetchRoadWidth(lng: number, lat: number) {

  this.roadWidthDetails = null;
  this.roadWidthConfirmed = null;

  this.loaderservice.show();
  this.roadWidthStatus = 'Fetching road width from server...';

  const payload = {
    licenceApplicationID: this.tokenservice.getTraderUserId(),
    latitude: lat,
    longitude: lng
  };

  this.newLicensesService.getRoadWidth(payload).subscribe({
    next: (res: any) => {

      if (res?.code === 'SUCCESS' && Array.isArray(res.data) && res.data.length > 0) {

        this.roadWidthDetails = res.data[0];
        this.roadWidthStatus = 'Road width detected automatically';

        this.notificationservice.show(
          res.message ?? 'Road width detected',
          'success'
        );

      } else {

        this.roadWidthDetails = null;
        this.roadWidthStatus = 'No road width data found';

        this.notificationservice.show(
          'No road data found. Please draw rectangle or enter manually.',
          'warning'
        );
      }

      this.loaderservice.hide();
    },

    error: (err) => {
      this.loaderservice.hide();

      const apiMsg = err?.error?.message ?? 'Unable to fetch road width';

      // 🚫 OUTSIDE BENGALURU
      if (err?.error?.code === 'OUTSIDE_GBA') {
        this.roadWidthStatus = apiMsg;

        this.notificationservice.show(
          apiMsg,
          'error'
        );
        return;
      }

      // ⏱ KGIS TIMEOUT
      if (err.status === 504) {
        this.roadWidthStatus = 'KGIS service timeout';

        this.notificationservice.show(
          apiMsg,
          'warning'
        );
        return;
      }

      //  KGIS FAILURE
      this.roadWidthStatus = apiMsg;

      this.notificationservice.show(
        apiMsg,
        'error'
      );
    }
  });
}





  /* =========================
     LOCATION SEARCH (NOMINATIM)
  ========================= */



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

  //#region  SaveAndPayLate
  /*saveAndPayLater() {
    this.loaderservice.show();
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

          loginID: this.tokenservice.getTraderUserId(),
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
            next: async(draftRes: any) => {
              this.tradeLicenseApplications.licenceApplicationID =
                draftRes.licenceApplicationID;
              await this.saveLocationDetails(this.tradeLicenseApplications.licenceApplicationID);
              await this.saveOrUpdateDocuments(this.tradeLicenseApplications.licenceApplicationID);
              this.loaderservice.hide();
              this.notificationservice.show('Draft saved successfully. You can continue later.', 'success');
            },
            error: err => {
              this.loaderservice.hide();
              console.log(err);
              this.notificationservice.show('Trade licence saved but application draft failed.', 'error');
            }
          });
      },
      error: err => {
        this.loaderservice.hide();
        this.notificationservice.show('Failed to save trade licence draft.', 'error');
      }
    });
  }*/

  saveDraft(): Promise<number> {
    return new Promise((resolve, reject) => {

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

      this.newLicensesService.post('/trade-licence', tradeLicencePayload)
        .subscribe({
          next: (res: any) => {

            const licenceApplicationDraftPayload = {
              finanicalYearID: this.tradeLicenseApplications.finanicalYearID,
              tradeTypeID: this.selectedTradeType ? this.selectedTradeType.tradeTypeID : 0,

              bescomRRNumber: this.tradeLicenseApplications.bescomRRNumber,
              tinNumber: this.tradeLicenseApplications.tinNumber,
              vatNumber: this.tradeLicenseApplications.vatNumber,

              licenceFromDate: this.tradeLicenseApplications.licenceFromDate,
              licenceToDate: this.tradeLicenseApplications.licenceToDate,

              tradeLicenceID: res.tradeLicenceID, // from API-1

              loginID: this.tokenservice.getTraderUserId(),
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

            this.newLicensesService
              .post('/licence-application/draft', licenceApplicationDraftPayload)
              .subscribe({
                next: async (draftRes: any) => {
                  this.tradeLicenseApplications.licenceApplicationID =
                    draftRes.licenceApplicationID;

                  await this.saveLocationDetails(draftRes.licenceApplicationID);
                  await this.saveOrUpdateDocuments(draftRes.licenceApplicationID);

                  resolve(draftRes.licenceApplicationID);
                },
                error: reject
              });
          },
          error: reject
        });
    });
  }

  private buildExistingDocsMap(docs: LicenseDocuments[]): { [documentId: number]: LicenseDocuments } {
    const map: { [documentId: number]: LicenseDocuments } = {};
    docs.forEach(d => map[d.DocumentID] = d);
    return map;
  }
  saveOrUpdateDocuments(licenceAppId: number): Promise<void> {
    return new Promise((resolve, reject) => {

      if (!licenceAppId) {
        this.notificationservice.show('Invalid Licence Application ID');
        resolve(); // resolve to avoid blocking caller
        return;
      }

      this.newLicensesService
        .getDocumentsByLicensesApplicationId(licenceAppId)
        .subscribe({
          next: (existingDocs) => {

            const existingDocsMap = this.buildExistingDocsMap(existingDocs);
            const keys = Object.keys(this.documents);

            if (!keys.length) {
              resolve(); // nothing to upload
              return;
            }

            let completed = 0;
            const total = keys.length;

            keys.forEach(key => {

              const doc = this.documents[key];
              const existing = existingDocsMap[doc.documentId];

              const formData = new FormData();
              formData.append('File', doc.file);
              formData.append('LicenceApplicationID', licenceAppId.toString());
              formData.append('DocumentID', doc.documentId.toString());

              const loginId = this.tokenservice.getUserId();
              if (!loginId) {
                this.notificationservice.show('Invalid user session');
                reject('Invalid user session');
                return;
              }
              formData.append('LoginID', loginId.toString());

              if (existing) {
                formData.append(
                  'ApplicationDocumentID',
                  existing.ApplicationDocumentID.toString()
                );
              }

              this.newLicensesService
                .saveOrUpdateDocument(formData)
                .subscribe({
                  next: () => {
                    completed++;
                    console.log(
                      `${existing ? 'Updated' : 'Inserted'} document`,
                      doc.documentId
                    );

                    if (completed === total) {
                      resolve(); // 🔥 all uploads finished
                    }
                  },
                  error: (err) => {
                    console.error('Upload failed', err);

                    // ❌ reject(err);
                    // ✅ allow flow to continue
                    completed++;

                    if (completed === total) {
                      resolve(); // continue even if some uploads failed
                    }
                  }
                });
            });

          },
          error: (err) => {
            console.error('Failed to fetch existing documents', err);
            reject(err);
          }
        });
    });
  }
  saveLocationDetails(licenceAppId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.latitude || !this.longitude || !this.roadWidthDetails) {
        this.notificationservice.show(
          'Location details are incomplete. Please select a location.',
          'warning'
        );
        return;
      }

      if (this.roadWidthConfirmed !== true) {
        this.notificationservice.show(
          'Please confirm the road width before continuing.',
          'warning'
        );
        return;
      }

      if(!licenceAppId){
        this.notificationservice.show('Invalid Licence Application ID');
        resolve(); // resolve to avoid blocking caller
        return;
      }

      const payload = {
        licenceApplicationID: licenceAppId,
        latitude: this.latitude,
        longitude: this.longitude,
        roadID: this.roadWidthDetails.roadType ?? '',
        roadWidthMtrs: this.roadWidthDetails.road_Width_mtrs ?? 0,
        roadCategoryCode: this.roadWidthDetails.roadCategoryCode ?? '',
        roadCategory: this.roadWidthDetails.roadCategory ?? '',
        loginID: this.tokenservice.getTraderUserId()
      };

      this.newLicensesService.saveLocationDetails(payload).subscribe({
        next: () => {
          resolve();
        },
        error: (err) => {
          console.error('Location save failed:', err);
          this.notificationservice.show(
            'Failed to save location details. Please try again.',
            'error'
          );
        }
      });
    });
  }

  onClickSaveAndPayLater() {
    this.loaderservice.show();
    this.saveDraft()
    .then(() => {
      this.loaderservice.hide();
        this.notificationservice.show(
          'Draft saved successfully. You can continue later.',
          'success'
        );
        this.router.navigate(['/trader']);
      })
      .catch(() => {
        this.loaderservice.hide();
        this.notificationservice.show('Save failed', 'error');
    });
  }

  //#endregion

  //#region ProccedForPayment
  proceedForPayment() {
    this.loaderservice.show();
    this.saveDraft().then(() => {
      this.loaderservice.hide();
      this.initiatePayment();
    })
    .catch(() => {
      this.loaderservice.hide();
      this.notificationservice.show(
        'Unable to save before payment',
        'error'
      );
    });
  }


  initiatePayment() {
    const payload = {
      licenceApplicationId: this.tradeLicenseApplications.licenceApplicationID,
      corporationId: 1,
      amount: this.licenseFee,
      applicantName: this.tokenservice.getUserFullName(),
  email: this.tradeLicenseApplicationDetails.emailID,

      phone: this.tradeLicenseApplicationDetails.mobileNumber
    };
    console.log(payload);
    this.newLicensesService.paymentIntiate(payload).subscribe({
      next: res => this.redirectToPayment(res.html),
      error: err => console.error('Payment initiation failed', err)
    });
  }


  redirectToPayment(html: string) {
    // 1. Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 2. Extract the form
    const form = tempDiv.querySelector('form') as HTMLFormElement;

    if (!form) {
      console.error('Payment form not found in response');
      return;
    }

    // 3. Append form to body
    document.body.appendChild(form);

    // 4. Manually submit the form
    form.submit();
  }

  //#endregion
}  