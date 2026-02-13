import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AdminApplicationFiltersComponent, AdminApplicationFilterState } from './components/admin-application-filters/admin-application-filters';
import { AdminApplicationTableComponent } from './components/admin-application-table/admin-application-table';
import { AdminApplication, AdminApplicationsService } from './admin-applications.service';
import { MLCConstituency, Ward, Zones } from '../../core/models/new-trade-licenses.model';

@Component({
  selector: 'app-admin-licence-applications',
  imports: [CommonModule, AdminApplicationFiltersComponent, AdminApplicationTableComponent],
  templateUrl: './admin-licence-applications.html',
  styleUrl: './admin-licence-applications.css',
})
export class AdminLicenceApplications implements OnDestroy {
  isLoadingApplications = false;
  applications: AdminApplication[] = [];
  zones: Zones[] = [];
  mohs: MLCConstituency[] = [];
  filteredMohs: MLCConstituency[] = [];
  wards: Ward[] = [];

  selectedZoneId: number | null = null;
  selectedMohId: number | null = null;
  selectedWardId: number | null = null;
  searchText = '';

  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;

  private filterTimer: ReturnType<typeof setTimeout> | null = null;
  private requestId = 0;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly adminApplicationsService: AdminApplicationsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadFilterMasters();
    this.loadAdminApplications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }
  }

  onFiltersChanged(filterState: AdminApplicationFilterState): void {
    const zoneChanged = this.selectedZoneId !== filterState.zoneId;
    const mohChanged = this.selectedMohId !== filterState.mohId;
    const wardChanged = this.selectedWardId !== filterState.wardId;

    this.selectedZoneId = filterState.zoneId;
    this.filteredMohs = this.selectedZoneId
      ? this.mohs.filter((moh) => moh.zoneID === this.selectedZoneId)
      : [...this.mohs];

    const hasSelectedMoh = this.filteredMohs.some((moh) => moh.mohID === filterState.mohId);
    if (!hasSelectedMoh && filterState.mohId !== null) {
      this.selectedMohId = null;
      this.selectedWardId = null;
      this.wards = [];
    } else {
      this.selectedMohId = filterState.mohId;
      this.selectedWardId = filterState.wardId;
    }

    if (mohChanged || zoneChanged) {
      this.selectedWardId = null;
      this.loadWardsForSelectedMoh();
    }

    if (zoneChanged || mohChanged || wardChanged) {
      this.pageNumber = 1;
      this.loadAdminApplications();
    }
  }

  onSearchChanged(value: string): void {
    this.searchText = value;
    this.pageNumber = 1;

    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }
    this.filterTimer = setTimeout(() => {
      this.loadAdminApplications();
    }, 350);
  }

  onPageChanged(page: number): void {
    this.pageNumber = page;
    this.loadAdminApplications();
  }

  onPageSizeChanged(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.loadAdminApplications();
  }

  onViewApplication(application: AdminApplication): void {
    if (!application.applicationNumber) {
      return;
    }
    const appNo = encodeURIComponent(application.applicationNumber);
    const licenceApplicationId = application.licenceApplicationID;
    this.router.navigate(['/admin/licence-certificate', appNo], {
      queryParams: { from: 'admin', licenceApplicationId }
    });
  }

  onOpenApplicationDetails(application: AdminApplication): void {
    if (!application.licenceApplicationID) {
      return;
    }
    this.router.navigate(['/admin/licence-applications', application.licenceApplicationID]);
  }

  private loadAdminApplications(): void {
    this.isLoadingApplications = true;
    const currentRequest = ++this.requestId;

    const query = {
      zoneId: this.selectedZoneId,
      mohId: this.selectedMohId,
      wardId: this.selectedWardId,
      applicationNumber: this.searchText?.trim() || null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    const sub = this.adminApplicationsService.getAdminApplications(query).subscribe({
      next: (response) => {
        if (currentRequest !== this.requestId) {
          return;
        }

        this.applications = response?.data ?? [];
        this.totalRecords = Number(response?.totalRecords ?? 0);
        this.pageNumber = Number(response?.pageNumber ?? this.pageNumber);
        this.pageSize = Number(response?.pageSize ?? this.pageSize);
        this.isLoadingApplications = false;
      },
      error: (error) => {
        if (currentRequest !== this.requestId) {
          return;
        }
        console.error('Failed to load admin applications', error);
        this.applications = [];
        this.totalRecords = 0;
        this.isLoadingApplications = false;
      }
    });

    this.subscriptions.add(sub);
  }

  private loadFilterMasters(): void {
    const sub = forkJoin({
      zones: this.adminApplicationsService.getZones(),
      mohs: this.adminApplicationsService.getMohs()
    }).subscribe({
      next: ({ zones, mohs }) => {
        this.zones = zones ?? [];
        this.mohs = mohs ?? [];
        this.filteredMohs = [...this.mohs];
      },
      error: (error) => {
        console.error('Failed to load application filters', error);
        this.zones = [];
        this.mohs = [];
        this.filteredMohs = [];
      }
    });

    this.subscriptions.add(sub);
  }

  private loadWardsForSelectedMoh(): void {
    this.wards = [];
    const targetMohs = this.selectedMohId
      ? this.mohs.filter((moh) => moh.mohID === this.selectedMohId)
      : this.selectedZoneId
        ? this.mohs.filter((moh) => moh.zoneID === this.selectedZoneId)
        : [];

    const constituencyIds = Array.from(
      new Set(
        targetMohs
          .map((moh) => moh.constituencyID)
          .filter((id): id is number => Number.isFinite(id) && id > 0)
      )
    );

    if (!constituencyIds.length) {
      return;
    }

    const wardRequests = constituencyIds.map((id) =>
      this.adminApplicationsService.getWardsByConstituency(id)
    );

    const sub = forkJoin(wardRequests).subscribe({
      next: (wardGroups) => {
        const merged = wardGroups.flat();
        const unique = new Map<number, Ward>();
        for (const ward of merged) {
          if (!unique.has(ward.wardID)) {
            unique.set(ward.wardID, ward);
          }
        }
        this.wards = Array.from(unique.values()).sort((a, b) =>
          (a.wardName || '').localeCompare(b.wardName || '')
        );
      },
      error: (error) => {
        console.error('Failed to load wards', error);
        this.wards = [];
      }
    });

    this.subscriptions.add(sub);
  }
}
