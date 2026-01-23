import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../shared/components/notification/notification.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { InspectionService } from './inspection.service';
import { LicenceApplicationModel, TradeLicensesApplicationDetails } from '../../core/models/trade-licenses-details.model';
import { AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-inspection',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inspection.html',
  styleUrl: './inspection.css',
})
export class Inspection {
  applicationNo!: string;

  // Mock inspection data (later replace with API)
  inspectionChecklist = [
    { label: 'Trade name board displayed', checked: false },
    { label: 'Fire safety compliance', checked: false },
    { label: 'Waste disposal arrangement', checked: false },
    { label: 'Health & hygiene maintained', checked: false }
  ];

  remarks: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationservice: NotificationService,
    private loaderservice: LoaderService,
    private inspectionservice: InspectionService,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.applicationNo = this.route.snapshot.paramMap.get('applicationNo')!;
  }

  //#region To load Map 
  private L: any;
  map: any;
  marker: any;

  // Example coordinates (replace with API values)
  latitude = 12.9716;
  longitude = 77.5946;

  initMap(): void {
    if (!this.L) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = this.L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 15,
      dragging: false,           // read-only for inspection
      scrollWheelZoom: false,
      doubleClickZoom: false
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.marker = this.L.marker(
      [this.latitude, this.longitude],
      { draggable: false }
    )
      .addTo(this.map)
      .bindPopup('Inspection Location')
      .openPopup();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }


  async ngAfterViewInit(): Promise<void> {
  if (!isPlatformBrowser(this.platformId)) return;

  const leaflet = await import('leaflet');
  this.L = leaflet;

  // Fix marker icon issue
  delete (this.L.Icon.Default.prototype as any)._getIconUrl;

  this.L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png'
  });

  setTimeout(() => {
    this.initMap();
  }, 0);
}

  //#endregion

//#region Pageload details when approver clicks on application ID
  licenceApplicationDetails : LicenceApplicationModel | null = null;
  tradeLicenceApplicationDetails : TradeLicensesApplicationDetails | null = null;
  locationDetails: any;

  loadApplicationDetailsByLicensesId(licenceApplicationID: number){
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
  }

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
    this.router.navigate(['/approver/approving-officer']);
  }

  cancel() {
    this.router.navigate(['/approver/approving-officer']);
  }
}
