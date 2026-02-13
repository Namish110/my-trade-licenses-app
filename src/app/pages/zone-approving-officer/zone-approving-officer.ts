import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { NotificationService } from '../../shared/components/notification/notification.service';
import {
  ZoneApproverApplication,
  ZoneApprovingOfficerService
} from './zone-approving-officer.service';

@Component({
  selector: 'app-zone-approving-officer',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './zone-approving-officer.html',
  styleUrl: './zone-approving-officer.css'
})
export class ZoneApprovingOfficer implements OnDestroy {
  applications: ZoneApproverApplication[] = [];
  filteredApplications: ZoneApproverApplication[] = [];
  pageApplications: ZoneApproverApplication[] = [];
  zones: string[] = [];
  wards: string[] = [];
  visibleStatuses: string[] = [];
  statusOptions: string[] = [];

  selectedZone = '';
  selectedWard = '';
  selectedStatus = '';
  searchText = '';

  pageNumber = 1;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalRecords = 0;
  totalPages = 0;
  pages: number[] = [];
  isLoading = false;

  private filterTimer: ReturnType<typeof setTimeout> | null = null;
  private requestId = 0;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly zoneApprovingOfficerService: ZoneApprovingOfficerService,
    private readonly tokenService: TokenService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadZoneApproverApplications();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }
  }

  loadZoneApproverApplications(): void {
    const loginId = this.tokenService.getUserId();
    if (!loginId) {
      this.notificationService.show('Invalid login id', 'warning');
      return;
    }

    this.isLoading = true;
    const currentRequest = ++this.requestId;

    const sub = this.zoneApprovingOfficerService
      .getZoneApproverApplications(loginId, this.pageNumber, this.pageSize)
      .subscribe({
        next: (response) => {
          if (currentRequest !== this.requestId) {
            return;
          }

          this.applications = response?.data ?? [];
          this.totalRecords = Number(response?.totalRecords ?? 0);
          this.pageNumber = Number(response?.pageNumber ?? this.pageNumber);
          this.pageSize = Number(response?.pageSize ?? this.pageSize);
          this.totalPages = Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
          this.visibleStatuses = response?.visibleStatuses ?? [];

          this.zones = Array.from(
            new Set(this.applications.map((app) => app.mohName).filter(Boolean))
          ).sort();
          this.wards = this.buildWardOptions();
          this.statusOptions = this.buildStatusOptions();

          if (this.selectedZone && !this.zones.includes(this.selectedZone)) {
            this.selectedZone = '';
          }
          if (this.selectedWard && !this.wards.includes(this.selectedWard)) {
            this.selectedWard = '';
          }
          if (this.selectedStatus && !this.statusOptions.includes(this.selectedStatus)) {
            this.selectedStatus = '';
          }

          this.applyLocalFilters();
          this.generatePages();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          if (currentRequest !== this.requestId) {
            return;
          }

          this.applications = [];
          this.filteredApplications = [];
          this.pageApplications = [];
          this.totalRecords = 0;
          this.totalPages = 0;
          this.visibleStatuses = [];
          this.zones = [];
          this.wards = [];
          this.statusOptions = [];
          this.pages = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });

    this.subscriptions.add(sub);
  }

  onZoneChanged(): void {
    this.selectedWard = '';
    this.wards = this.buildWardOptions();
    if (this.selectedWard && !this.wards.includes(this.selectedWard)) {
      this.selectedWard = '';
    }
    this.applyLocalFilters();
  }

  onWardChanged(): void {
    this.applyLocalFilters();
  }

  onStatusChanged(): void {
    this.applyLocalFilters();
  }

  onSearchChanged(): void {
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }

    this.filterTimer = setTimeout(() => {
      this.applyLocalFilters();
    }, 300);
  }

  onOpenApplicationDetails(application: ZoneApproverApplication): void {
    if (!application.licenceApplicationID) {
      return;
    }
    this.router.navigate(
      ['/zone-approver/licence-applications', application.licenceApplicationID],
      { queryParams: { from: 'zone-approver' } }
    );
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageNumber = page;
    this.loadZoneApproverApplications();
  }

  onPageSizeChanged(value: number): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed === this.pageSize) {
      return;
    }
    this.pageSize = parsed;
    this.pageNumber = 1;
    this.loadZoneApproverApplications();
  }

  private generatePages(): void {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.pageNumber - 2);
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    this.pages = [];

    for (let page = startPage; page <= endPage; page++) {
      this.pages.push(page);
    }
  }

  private applyLocalFilters(): void {
    const search = this.searchText.trim().toLowerCase();
    const selectedZone = this.selectedZone.trim().toLowerCase();
    const selectedWard = this.selectedWard.trim().toLowerCase();
    const selectedStatus = this.selectedStatus.trim().toLowerCase();

    this.filteredApplications = this.applications.filter((app) => {
      const matchesZone = !selectedZone || (app.mohName || '').toLowerCase() === selectedZone;
      const matchesWard = !selectedWard || (app.wardName || '').toLowerCase() === selectedWard;
      const matchesStatus =
        !selectedStatus ||
        (app.licenceApplicationStatusName || '').toLowerCase() === selectedStatus;
      const matchesSearch =
        !search ||
        (app.applicationNumber || '').toLowerCase().includes(search) ||
        (app.applicantName || '').toLowerCase().includes(search) ||
        (app.tradeName || '').toLowerCase().includes(search) ||
        (app.mobileNumber || '').toLowerCase().includes(search) ||
        (app.wardName || '').toLowerCase().includes(search) ||
        (app.licenceApplicationStatusName || '').toLowerCase().includes(search);

      return matchesZone && matchesWard && matchesStatus && matchesSearch;
    });

    this.pageApplications = this.filteredApplications;
  }

  private buildWardOptions(): string[] {
    const selectedZone = this.selectedZone.trim().toLowerCase();
    const source = selectedZone
      ? this.applications.filter((app) => (app.mohName || '').toLowerCase() === selectedZone)
      : this.applications;

    return Array.from(new Set(source.map((app) => app.wardName).filter(Boolean))).sort();
  }

  private buildStatusOptions(): string[] {
    if (this.visibleStatuses.length > 0) {
      return [...this.visibleStatuses];
    }
    return Array.from(
      new Set(this.applications.map((app) => app.licenceApplicationStatusName).filter(Boolean))
    ).sort();
  }

  getStatusBadgeClass(statusName: string): string {
    const normalized = statusName?.trim().toUpperCase() ?? '';

    if (normalized === 'APPROVED') {
      return 'badge text-bg-success';
    }
    if (normalized === 'REJECTED') {
      return 'badge text-bg-danger';
    }
    if (normalized === 'OBJECTION') {
      return 'badge text-bg-warning text-dark';
    }
    if (normalized === 'INSPECTED') {
      return 'badge text-bg-info';
    }
    return 'badge text-bg-secondary';
  }

  get showingFrom(): number {
    if (!this.displayTotalRecords) {
      return 0;
    }
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min((this.pageNumber - 1) * this.pageSize + this.pageApplications.length, this.displayTotalRecords);
  }

  get displayTotalRecords(): number {
    const hasLocalFilter = Boolean(
      this.searchText.trim() ||
      this.selectedZone.trim() ||
      this.selectedWard.trim() ||
      this.selectedStatus.trim()
    );
    return hasLocalFilter ? this.filteredApplications.length : this.totalRecords;
  }
}
