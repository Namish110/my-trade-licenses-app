import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { InspectionService } from './inspection.service';
import { AllApprovedApplication, ApprovedApplications, LicenceApplicationModel, TradeLicensesApplicationDetails } from '../../core/models/trade-licenses-details.model';
import { AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TokenService } from '../../core/services/token.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { LocationDetails } from './inspection.model';

interface InspectionPhoto {
  file: File;
  preview: string;
}

interface LicenceProcessTimelineItem {
  licenceFlowID: number;
  licenceApplicationID: number;
  loginID: number;
  licenceProcessName: string;
  remarks: string;
  ActionReasonIds: string;
  entryDate: string;
}

@Component({
  selector: 'app-inspection',
  imports: [CommonModule, RouterModule, FormsModule, GoogleMapsModule],
  templateUrl: './inspection.html',
  styleUrl: './inspection.css',
})
export class Inspection {
  applicationNo!: string;
  role = '';
  get isSeniorApprover(): boolean {
    return this.role === 'SeniorApprover' || this.role === 'SENIOR_APPROVER';
  }

  // Mock inspection data (later replace with API)
  inspectionChecklist = [
    { label: 'Trade name board displayed', checked: false },
    { label: 'Fire safety compliance', checked: false },
    { label: 'Waste disposal arrangement', checked: false },
    { label: 'Health & hygiene maintained', checked: false }
  ];

  remarks: string = '';
  isSubmitting = false;
  timeline: LicenceProcessTimelineItem[] = [];
  timelineLoading = false;
  timelineError = '';
  private setSubmitting(value: boolean) {
    // Defer to avoid ExpressionChangedAfterItHasBeenChecked in dev mode.
    setTimeout(() => {
      this.isSubmitting = value;
      this.cdr.detectChanges();
    }, 0);
  }

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private notificationservice: NotificationService,
    private loaderservice: LoaderService,
    private inspectionservice: InspectionService,
    private tokenservice: TokenService,
    private cdr:ChangeDetectorRef,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.applicationNo = this.activeroute.snapshot.paramMap.get('applicationNo')!;
    this.role = this.tokenservice.getRole();
    this.loadAppliedApproverApplicatiosn();
    this.loadApplicationDetails();
    this.loadTimeline();
  }

  //#region To load Map 
  
  //#endregion

//#region Pageload details when approver clicks on application ID
  licenceApplicationDetails: AllApprovedApplication | null = null;
  locationDetails: any;
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  loadAppliedApproverApplicatiosn(): void{
    const loginId = this.tokenservice.getUserId();
    if(!loginId){
      this.notificationservice.show('Invalid login id', 'warning');
      return;
    }
    const appNo = Number(this.applicationNo);
    if (isNaN(appNo)) {
      console.error('Invalid application number');
      return;
    }
    const source$ = this.isSeniorApprover
      ? this.inspectionservice.getSeniorApproverApplications(loginId, appNo, this.pageNumber, this.pageSize)
      : this.inspectionservice.getAppliedApproverApplications(loginId, appNo, this.pageNumber, this.pageSize);

    source$.subscribe({
      next: (res: ApprovedApplications) => {
        if (res.data && res.data.length > 0) {
          this.licenceApplicationDetails = res.data[0];
          console.log(this.licenceApplicationDetails);
        }
        this.totalRecords = res.totalRecords;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.licenceApplicationDetails = null;
        this.cdr.detectChanges();
      }
    });
  }

  //For Map
  loadlocationDetails: LocationDetails | null = null;
  locationName: string = 'Not Available';
  mapCenter!: google.maps.LatLngLiteral;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    draggable: false,
    zoomControl: false
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  loadApplicationDetails() {
    // Example API response
    this.inspectionservice.getgeolocationByLicensesAppId(Number(this.applicationNo)).subscribe({
      next: (res) => {
        this.loadlocationDetails = res;
         // ✅ SET MAP CENTER AFTER DATA COMES
        this.mapCenter = {
          lat: Number(res.latitude),
          lng: Number(res.longitude)
        };

        // Optional but safe
        this.cdr.detectChanges();
        console.log(this.loadlocationDetails);
      },
      error: (err) => {
        console.error('Error fetching location details:', err);
      }
    });
    // this.mapCenter = {
    //   lat: this.loadlocationDetails?.latitude || 0,
    //   lng: this.loadlocationDetails?.longitude || 0
    // };
  }


  /*loadApplicationDetailsByLicensesId(licenceApplicationID: number){
    if(!licenceApplicationID){
      this.notificationservice.show('Something went wrong please check with the application Id', 'warning');
      return;
    }
    this.inspectionservice.getlicenceApplicationDetails(licenceApplicationID).subscribe({
      next: async(res)=>{
        console.log(res);
        this.licenceApplicationDetails = res;
        await this.loadtradeLicenceApplicationDetails(this.licenceApplicationDetails.tradeLicenceID);
      },
      error:(err)=>{

      }
    });
  }

  loadtradeLicenceApplicationDetails(tradeLicensesId : number) : Promise<void> {
    return new Promise((resolve, reject) => {
      if(!tradeLicensesId){
        this.notificationservice.show('Something went wrong please check with the application Id', 'warning');
        return;
      }
      this.inspectionservice.gettradelicenceApplicationDetails(tradeLicensesId).subscribe({
        next:(res)=>{
          this.tradeLicenceApplicationDetails = res;
        },
        error:(err)=>{

        }
      });
    });
  }

  loadlicensesApplicationLocationDetailsById(licenceApplicationID: number){
    if(!licenceApplicationID){
      this.notificationservice.show('Something went wrong please check with the application Id', 'warning');
      return;
    }
    this.inspectionservice.getgeolocationByLicensesAppId(licenceApplicationID).subscribe({
      next:(res)=>{
        this.locationDetails = res;
      },
      error:(err)=>{

      }
    });
  }*/

  loadTradeType(){
    //this.inspectionservice.getTradeTypeById().subscribe({
  }
  //#endregions

  downloadDocument(documentName: string){

  }
  saveDraft() {
    console.log('Draft saved', {
      applicationNo: this.applicationNo,
      checklist: this.inspectionChecklist,
      remarks: this.remarks
    });
  }

  submitInspection() {
    console.log('Inspection submitted', {
      applicationNo: this.applicationNo,
      checklist: this.inspectionChecklist,
      remarks: this.remarks
    });

    const playload = {
      licenceApplicationID: Number(this.applicationNo),
      licenceProcessID: 3, //APPROVED
      remarks: this.remarks,
      actionReasonIds: '1'
    };
    if(!this.remarks){
      this.notificationservice.show('Please enter remarks before submitting inspection', 'warning');
      return;
    }
    //inspectionPhotos: this.inspectionChecklist.filter(item => item.checked).map(item => item.label)
    this.notificationservice.show('Inspection submitted successfully', 'success');
    this.router.navigate(['/approver/approving-officer']);
    // this.inspectionservice.submitInspection(playload).subscribe({
    //   next: (res) => {
        
    //   },
    //   error: (err) => {
    //     this.notificationservice.show('Error submitting inspection', 'error');
    //   }
    // });
  }

  cancel() {
    this.notificationservice.show('Inspection cancelled', 'info');
    this.router.navigate(['/approver/approving-officer']);
  }

  loadTimeline() {
    const appId = Number(this.applicationNo);
    if (!appId || Number.isNaN(appId)) {
      return;
    }
    this.timelineLoading = true;
    this.timelineError = '';
    this.inspectionservice.getLicenceProcessTimeline(appId).subscribe({
      next: (items) => {
        this.timeline = items || [];
        this.timelineLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.timelineLoading = false;
        this.timelineError = 'Unable to load timeline.';
        this.cdr.detectChanges();
      }
    });
  }

  submitProcessAction(licenceProcessID: number, currentStatusID: number) {
    if (this.isSubmitting) {
      return;
    }

    const loginId = this.tokenservice.getUserId();
    if (!loginId) {
      this.notificationservice.show('Invalid login id', 'warning');
      return;
    }

    const licenceApplicationID =
      this.licenceApplicationDetails?.licenceApplicationID ?? Number(this.applicationNo);
    if (!licenceApplicationID || Number.isNaN(licenceApplicationID)) {
      this.notificationservice.show('Invalid licence application id', 'warning');
      return;
    }

    this.setSubmitting(true);

    this.inspectionservice
      .submitLicenceProcessAction({
        licenceApplicationID,
        loginID: loginId,
        licenceProcessID,
        currentStatus: String(currentStatusID),
        currentStatusID,
        remarks: this.remarks || '',
        actionReasonIds: ''
      })
      .subscribe({
        next: () => {
          this.setSubmitting(false);
          this.notificationservice.show('Status updated successfully', 'success');
          this.router.navigate(['/approver/approving-officer']);
        },
        error: (error) => {
          this.setSubmitting(false);
          const message =
            error?.error?.message ||
            error?.error?.title ||
            'Failed to update status';
          this.notificationservice.show(message, 'error');
        }
      });
  }

  /* =========================
     CAMERA / FILE UPLOAD
  ========================= */
  inspectionPhotos: InspectionPhoto[] = [];

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];

      // Size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Each photo must be less than 5MB');
        continue;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.inspectionPhotos = [
          ...this.inspectionPhotos,
          {
            file: file,
            preview: reader.result as string
          }
        ];
      };

      reader.readAsDataURL(file);
    }

    // Reset input
    input.value = '';
  }

  removePhoto(index: number) {
    this.inspectionPhotos.splice(index, 1);
  }

}
