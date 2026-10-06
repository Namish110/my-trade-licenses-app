import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription, catchError, finalize, forkJoin, of, retry, timeout } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { ZoneApprovingOfficerService } from '../../pages/zone-approving-officer/zone-approving-officer.service';
import { ZoneApproverApplication } from '../../pages/zone-approving-officer/zone-approving-officer.service';

interface KpiCard {
  label: string;
  value: number;
  tone: 'primary' | 'warning' | 'success' | 'danger';
}

interface ZoneWorkloadRow {
  zone: string;
  pending: number;
  forwarded: number;
  objections: number;
}

@Component({
  selector: 'app-zoneapprover-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './zoneapprover-dashboard.html',
  styleUrl: './zoneapprover-dashboard.css'
})
export class ZoneapproverDashboard implements OnDestroy {
  isLoading = false;
  loadError = '';
  private requestSub: Subscription | null = null;
  private bootstrapTimer: ReturnType<typeof setTimeout> | null = null;
  private parallaxX = 0;
  private parallaxY = 0;

  kpis: KpiCard[] = [
    { label: 'Inspected in Queue', value: 0, tone: 'primary' },
    { label: 'Objections Raised', value: 0, tone: 'warning' },
    { label: 'Rejected', value: 0, tone: 'danger' },
    { label: 'Grand Total', value: 0, tone: 'success' }
  ];

  zoneSummary: ZoneWorkloadRow[] = [];

  constructor(
    private readonly zoneApprovingOfficerService: ZoneApprovingOfficerService,
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

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IN').format(value || 0);
  }

  get actionQueue(): string[] {
    const inspected = this.kpis[0]?.value ?? 0;
    const objections = this.kpis[1]?.value ?? 0;
    const rejected = this.kpis[2]?.value ?? 0;
    const total = this.kpis[3]?.value ?? 0;

    return [
      `${inspected} inspected applications in queue`,
      `${objections} applications currently in objection`,
      `${rejected} rejected out of ${total} total applications`
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

  private loadDashboard(loginId: number): void {
    this.requestSub?.unsubscribe();
    this.requestSub = null;
    this.isLoading = true;
    this.loadError = '';

    this.requestSub = this.zoneApprovingOfficerService
      .getZoneApproverDashboard(loginId)
      .pipe(
        timeout(10000),
        retry({ count: 1, delay: 800 }),
        catchError(() => of(null))
      )
      .subscribe({
        next: (dashboardResponse) => {
          const dashboard = dashboardResponse?.dashboard ?? dashboardResponse?.Dashboard ?? {};

          this.kpis = [
            { label: 'Inspected in Queue', value: this.pickNumber(dashboard, ['TotalInspected', 'totalInspected', 'Inspected', 'inspected']), tone: 'primary' },
            { label: 'Objections Raised', value: this.pickNumber(dashboard, ['TotalObjection', 'totalObjection', 'Objection', 'objection', 'TotalObjections', 'totalObjections']), tone: 'warning' },
            { label: 'Rejected', value: this.pickNumber(dashboard, ['TotalRejected', 'totalRejected', 'Rejected', 'rejected']), tone: 'danger' },
            { label: 'Grand Total', value: this.pickNumber(dashboard, ['GrandTotal', 'grandTotal', 'Total', 'total']), tone: 'success' }
          ];

          const apiZoneSummary = this.extractZoneSummary(dashboard);
          if (apiZoneSummary.length > 0) {
            this.zoneSummary = apiZoneSummary;
            this.loadError = '';
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
          }

          this.loadZoneSummaryFromApplications(loginId);
        },
        error: () => {
          this.loadError = 'Dashboard service is unavailable. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private loadZoneSummaryFromApplications(loginId: number): void {
    this.requestSub?.unsubscribe();
    this.requestSub = forkJoin({
      dashboard: this.zoneApprovingOfficerService.getZoneApproverDashboard(loginId).pipe(catchError(() => of(null))),
      applications: this.zoneApprovingOfficerService.getZoneApproverApplications(loginId, 1, 500).pipe(catchError(() => of(null)))
    })
      .pipe(
        timeout(10000),
        retry({ count: 1, delay: 800 }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: ({ dashboard, applications }) => {
          const dashboardData = dashboard?.dashboard ?? dashboard?.Dashboard ?? {};
          const rowsFromDashboard = this.extractZoneSummary(dashboardData);
          if (rowsFromDashboard.length > 0) {
            this.zoneSummary = rowsFromDashboard;
          } else {
            const apps: ZoneApproverApplication[] = applications?.data ?? applications?.Data ?? [];
            this.zoneSummary = this.aggregateZoneSummary(apps);
          }
          this.loadError = '';
          this.cdr.detectChanges();
        },
        error: () => {
          this.loadError = 'Dashboard service is unavailable. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  private extractZoneSummary(dashboard: Record<string, any>): ZoneWorkloadRow[] {
    const rows =
      dashboard?.['zoneSummary'] ??
      dashboard?.['ZoneSummary'] ??
      dashboard?.['zones'] ??
      dashboard?.['Zones'] ??
      [];

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows
      .map((row: any) => ({
        zone: String(row?.zone ?? row?.Zone ?? row?.zoneName ?? row?.ZoneName ?? row?.mohName ?? row?.MohName ?? '').trim(),
        pending: this.pickNumber(row, ['pending', 'Pending', 'pendingCrossCheck', 'PendingCrossCheck', 'totalPending', 'TotalPending', 'inspected', 'Inspected']),
        forwarded: this.pickNumber(row, ['forwarded', 'Forwarded', 'forwardedToSenior', 'ForwardedToSenior', 'totalForwarded', 'TotalForwarded']),
        objections: this.pickNumber(row, ['objections', 'Objections', 'objection', 'Objection', 'totalObjection', 'TotalObjection'])
      }))
      .filter((row) => !!row.zone);
  }

  private aggregateZoneSummary(apps: ZoneApproverApplication[]): ZoneWorkloadRow[] {
    const grouped = new Map<string, ZoneWorkloadRow>();

    for (const app of apps) {
      const zone = String(app?.mohName || 'Unknown Zone').trim();
      const status = String(app?.licenceApplicationStatusName || '').trim().toUpperCase();
      const current = grouped.get(zone) ?? { zone, pending: 0, forwarded: 0, objections: 0 };

      if (status.includes('OBJECTION')) {
        current.objections += 1;
      } else if (status.includes('FORWARD')) {
        current.forwarded += 1;
      } else {
        current.pending += 1;
      }

      grouped.set(zone, current);
    }

    return Array.from(grouped.values()).sort((a, b) => a.zone.localeCompare(b.zone));
  }

  private pickNumber(source: Record<string, any>, keys: string[]): number {
    for (const key of keys) {
      const value = Number(source?.[key]);
      if (Number.isFinite(value)) {
        return value;
      }
    }
    return 0;
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
