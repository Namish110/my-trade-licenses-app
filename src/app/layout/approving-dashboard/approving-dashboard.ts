import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription, finalize, retry, timeout } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { ApprovingOfficerService } from '../../pages/approving-officer/approving-officer.service';

interface ApproverDashboardData {
  TotalApplied: number;
  TotalObjection: number;
  TotalRejected: number;
  GrandTotal: number;
}

@Component({
  selector: 'app-approving-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './approving-dashboard.html',
  styleUrl: './approving-dashboard.css',
})
export class ApprovingDashboard implements OnDestroy {
  isLoading = false;
  loadError = '';
  lastUpdated = new Date();
  private requestSub: Subscription | null = null;
  private bootstrapTimer: ReturnType<typeof setTimeout> | null = null;

  stats: ApproverDashboardData = {
    TotalApplied: 0,
    TotalObjection: 0,
    TotalRejected: 0,
    GrandTotal: 0
  };

  constructor(
    private readonly approvingOfficerService: ApprovingOfficerService,
    private readonly tokenService: TokenService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.bootstrapDashboardLoad();
  }

  ngOnDestroy(): void {
    this.requestSub?.unsubscribe();
    this.requestSub = null;
    if (this.bootstrapTimer) {
      clearTimeout(this.bootstrapTimer);
      this.bootstrapTimer = null;
    }
  }

  loadDashboard(loginIdArg?: number): void {
    const loginId = loginIdArg ?? this.resolveLoginId();
    if (!loginId) {
      this.loadError = 'Unable to resolve login id.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.requestSub?.unsubscribe();
    this.requestSub = null;
    this.isLoading = true;
    this.loadError = '';

    this.requestSub = this.approvingOfficerService
      .getApproverDashboard(loginId)
      .pipe(
        timeout(10000),
        retry({ count: 1, delay: 800 }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: { data?: any; Data?: any }) => {
          const data = response?.data ?? response?.Data ?? {};
          this.stats = {
            TotalApplied: Number(data?.TotalApplied ?? data?.totalApplied ?? 0),
            TotalObjection: Number(data?.TotalObjection ?? data?.totalObjection ?? 0),
            TotalRejected: Number(data?.TotalRejected ?? data?.totalRejected ?? 0),
            GrandTotal: Number(data?.GrandTotal ?? data?.grandTotal ?? 0)
          };
          this.lastUpdated = new Date();
          this.loadError = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadError = 'Dashboard service is unavailable. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  private bootstrapDashboardLoad(attempt = 0): void {
    const loginId = this.resolveLoginId();
    if (loginId) {
      this.loadDashboard(loginId);
      return;
    }

    if (attempt >= 10) {
      this.loadError = 'Unable to resolve login id. Please sign in again.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.bootstrapTimer = setTimeout(() => this.bootstrapDashboardLoad(attempt + 1), 300);
  }

  get totalAppliedPercent(): number {
    return this.toPercent(this.stats.TotalApplied);
  }

  get totalObjectionPercent(): number {
    return this.toPercent(this.stats.TotalObjection);
  }

  get totalRejectedPercent(): number {
    return this.toPercent(this.stats.TotalRejected);
  }

  get accountedPercent(): number {
    const accounted = this.stats.TotalApplied + this.stats.TotalObjection + this.stats.TotalRejected;
    return this.stats.GrandTotal > 0 ? Math.min(100, (accounted / this.stats.GrandTotal) * 100) : 0;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  }

  private toPercent(value: number): number {
    return this.stats.GrandTotal > 0 ? (value / this.stats.GrandTotal) * 100 : 0;
  }

  private resolveLoginId(): number | null {
    const decoded = this.tokenService.getDecodedToken() as any;
    const candidates = [
      decoded?.loginID,
      decoded?.loginId,
      decoded?.LoginID,
      decoded?.sub,
      this.tokenService.getEffectiveUserId(),
      this.tokenService.getUserId(),
      this.tokenService.getTraderUserId()
    ];
    for (const candidate of candidates) {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return null;
  }
}
