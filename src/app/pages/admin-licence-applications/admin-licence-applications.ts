import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalAdminService } from '../portal-admin/portal-admin.service';

interface AdminApplication {
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

@Component({
  selector: 'app-admin-licence-applications',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-licence-applications.html',
  styleUrl: './admin-licence-applications.css',
})
export class AdminLicenceApplications {
  isLoadingApplications = false;
  applications: AdminApplication[] = [];
  totalRecords = 0;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  filters = {
    zoneId: '',
    mohId: '',
    wardId: '',
    licenceApplicationId: '',
    applicationNumber: '',
    status: 'ALL',
  };

  constructor(
    private portalAdminService: PortalAdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private filterTimer: any = null;
  private requestId = 0;

  ngOnInit(): void {
    this.loadAdminApplications();
  }

  loadAdminApplications(): void {
    this.isLoadingApplications = true;
    const currentRequest = ++this.requestId;
    this.portalAdminService
      .getAdminApplications({
        zoneId: this.toNumberOrNull(this.filters.zoneId),
        mohId: this.toNumberOrNull(this.filters.mohId),
        wardId: this.toNumberOrNull(this.filters.wardId),
        licenceApplicationId: this.toNumberOrNull(this.filters.licenceApplicationId),
        applicationNumber: this.filters.applicationNumber?.trim() || null,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
      .subscribe({
        next: (response) => {
          if (currentRequest !== this.requestId) {
            return;
          }
          const data = (response?.data ?? []) as AdminApplication[];
          const statusFilter = this.filters.status?.trim().toUpperCase();
          const isStatusFiltered = statusFilter && statusFilter !== 'ALL';
          this.applications = isStatusFiltered
            ? data.filter((app: AdminApplication) =>
                (app.licenceApplicationStatusName || '').toUpperCase() === statusFilter
              )
            : data;

          if (isStatusFiltered) {
            this.totalRecords = this.applications.length;
            this.totalPages = 1;
            this.pageNumber = 1;
            this.pages = [1];
          } else {
            this.totalRecords = response?.totalRecords ?? 0;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
            this.generatePages();
          }
          this.isLoadingApplications = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (currentRequest !== this.requestId) {
            return;
          }
          console.error('Failed to load admin applications', err);
          this.isLoadingApplications = false;
          this.cdr.detectChanges();
        }
      });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadAdminApplications();
  }

  onFiltersChanged(): void {
    this.pageNumber = 1;
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }
    this.filterTimer = setTimeout(() => {
      this.loadAdminApplications();
    }, 400);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageNumber = page;
    this.loadAdminApplications();
  }

  generatePages() {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.pageNumber - 2);
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    this.pages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  get showingFrom(): number {
    if (this.totalRecords === 0) {
      return 0;
    }
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }

  onGenerateLicence(applicationNumber: string, licenceApplicationId?: number) {
    if (!applicationNumber) {
      return;
    }
    this.router.navigate(['/admin/licence-certificate', applicationNumber], {
      queryParams: {
        from: 'admin',
        licenceApplicationId: licenceApplicationId ?? null
      }
    });
  }

  openDetails(licenceApplicationId: number) {
    if (!licenceApplicationId) {
      return;
    }
    this.router.navigate(['/admin/licence-applications', licenceApplicationId]);
  }

  private toNumberOrNull(value: string): number | null {
    const trimmed = value?.trim();
    if (!trimmed) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
