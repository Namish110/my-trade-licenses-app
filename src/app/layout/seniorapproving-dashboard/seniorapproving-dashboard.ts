import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription, finalize, retry, timeout } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { SeniorApprovingOfficerService } from '../../pages/senior-approving-officer/senior-approving-officer.service';

interface SeniorDashboardData {
  TotalForwarded: number;
  TotalObjection: number;
  TotalApproved: number;
  TotalRejected: number;
  GrandTotal: number;
}

@Component({
  selector: 'app-seniorapproving-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './seniorapproving-dashboard.html',
  styleUrl: './seniorapproving-dashboard.css',
})
export class SeniorapprovingDashboard implements OnDestroy {
  isLoading = false;
  loadError = '';
  lastUpdated = new Date();
  private requestSub: Subscription | null = null;
  private bootstrapTimer: ReturnType<typeof setTimeout> | null = null;
  private parallaxX = 0;
  private parallaxY = 0;

  stats: SeniorDashboardData = {
    TotalForwarded: 0,
    TotalObjection: 0,
    TotalApproved: 0,
    TotalRejected: 0,
    GrandTotal: 0
  };

  constructor(
    private readonly seniorApprovingOfficerService: SeniorApprovingOfficerService,
    private readonly tokenService: TokenService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

    this.requestSub = this.seniorApprovingOfficerService
      .getSeniorApproverDashboard(loginId)
      .pipe(
        timeout(10000),
        retry({ count: 1, delay: 800 }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          const data = response?.dashboard ?? response?.Dashboard ?? {};
          this.stats = {
            TotalForwarded: Number(data?.TotalForwarded ?? data?.totalForwarded ?? 0),
            TotalObjection: Number(data?.TotalObjection ?? data?.totalObjection ?? 0),
            TotalApproved: Number(data?.TotalApproved ?? data?.totalApproved ?? 0),
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

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  }

  onParallaxMove(event: MouseEvent): void {
    const host = event.currentTarget as HTMLElement | null;
    if (!host) {
      return;
    }

    const rect = host.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    this.parallaxX = Math.max(-1, Math.min(1, x));
    this.parallaxY = Math.max(-1, Math.min(1, y));
  }

  resetParallax(): void {
    this.parallaxX = 0;
    this.parallaxY = 0;
  }

  layerTransform(depth: number): string {
    return `translate3d(${this.parallaxX * depth}px, ${this.parallaxY * depth}px, 0)`;
  }

  get decisionMixGradient(): string {
    const forwarded = this.totalForwardedPercent;
    const objection = this.totalObjectionPercent;
    const approved = this.totalApprovedPercent;
    const rejected = this.totalRejectedPercent;

    const s1 = forwarded;
    const s2 = s1 + objection;
    const s3 = s2 + approved;
    const s4 = Math.min(100, s3 + rejected);

    return `conic-gradient(
      #4f46e5 0% ${s1}%,
      #f59e0b ${s1}% ${s2}%,
      #0891b2 ${s2}% ${s3}%,
      #ef4444 ${s3}% ${s4}%,
      #e2e8f0 ${s4}% 100%
    )`;
  }

  get totalForwardedPercent(): number {
    return this.toPercent(this.stats.TotalForwarded);
  }

  get totalObjectionPercent(): number {
    return this.toPercent(this.stats.TotalObjection);
  }

  get totalApprovedPercent(): number {
    return this.toPercent(this.stats.TotalApproved);
  }

  get totalRejectedPercent(): number {
    return this.toPercent(this.stats.TotalRejected);
  }

  get accountedPercent(): number {
    const accounted =
      this.stats.TotalForwarded +
      this.stats.TotalObjection +
      this.stats.TotalApproved +
      this.stats.TotalRejected;
    return this.stats.GrandTotal > 0 ? Math.min(100, (accounted / this.stats.GrandTotal) * 100) : 0;
  }

  private toPercent(value: number): number {
    return this.stats.GrandTotal > 0 ? (value / this.stats.GrandTotal) * 100 : 0;
  }

  get decisionBars(): Array<{ label: string; value: number; percent: number; tone: string }> {
    return [
      {
        label: 'Forwarded',
        value: this.stats.TotalForwarded,
        percent: this.totalForwardedPercent,
        tone: 'forwarded'
      },
      {
        label: 'Objection',
        value: this.stats.TotalObjection,
        percent: this.totalObjectionPercent,
        tone: 'objection'
      },
      {
        label: 'Approved',
        value: this.stats.TotalApproved,
        percent: this.totalApprovedPercent,
        tone: 'approved'
      },
      {
        label: 'Rejected',
        value: this.stats.TotalRejected,
        percent: this.totalRejectedPercent,
        tone: 'rejected'
      }
    ];
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
