import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { PortalAdminService } from '../portal-admin/portal-admin.service';
import { InspectionService } from '../inspection/inspection.service';
import { LocationDetails } from '../inspection/inspection.model';

interface AdminApplicationDetails {
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
  zoneID: number;
  zoneName: string;
  mohID: number;
  mohName: string;
  wardID: number;
  wardName: string;
  loginID: number;
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
  selector: 'app-admin-licence-application-details',
  imports: [CommonModule, RouterModule, GoogleMapsModule],
  templateUrl: './admin-licence-application-details.html',
  styleUrl: './admin-licence-application-details.css',
})
export class AdminLicenceApplicationDetails {
  loading = true;
  errorMessage = '';
  details: AdminApplicationDetails | null = null;
  applicationNo = '';
  timeline: LicenceProcessTimelineItem[] = [];
  timelineLoading = false;
  timelineError = '';

  inspectionChecklist = [
    { label: 'Trade name board displayed', checked: false },
    { label: 'Fire safety compliance', checked: false },
    { label: 'Waste disposal arrangement', checked: false },
    { label: 'Health & hygiene maintained', checked: false }
  ];

  remarks = '';

  loadlocationDetails: LocationDetails | null = null;
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    draggable: false,
    zoomControl: true
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  constructor(
    private route: ActivatedRoute,
    private portalAdminService: PortalAdminService,
    private inspectionService: InspectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('licenceApplicationId') ?? '';
    const id = Number(idParam);
    if (!id) {
      this.loading = false;
      this.errorMessage = 'Invalid application id.';
      return;
    }

    this.portalAdminService
      .getAdminApplications({
        licenceApplicationId: id,
        pageNumber: 1,
        pageSize: 10
      })
      .subscribe({
        next: (response) => {
          const data = response?.data ?? [];
          this.details = data?.[0] ?? null;
          this.applicationNo = this.details?.applicationNumber ?? idParam;
          this.loading = false;
          if (!this.details) {
            this.errorMessage = 'Application not found.';
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load application details.';
          this.cdr.detectChanges();
        }
      });

    this.inspectionService.getgeolocationByLicensesAppId(id).subscribe({
      next: (res) => {
        this.loadlocationDetails = res;
        this.mapCenter = {
          lat: this.loadlocationDetails?.latitude || 0,
          lng: this.loadlocationDetails?.longitude || 0
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadlocationDetails = null;
        this.cdr.detectChanges();
      }
    });

    this.timelineLoading = true;
    this.timelineError = '';
    this.inspectionService.getLicenceProcessTimeline(id).subscribe({
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

  downloadDocument(): void {
    return;
  }
}
