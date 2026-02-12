import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LicenceTemplate } from '../../shared/components/licence-template/licence-template';
import { InspectionService } from '../inspection/inspection.service';
import { LicenceApplicationModel } from '../../core/models/trade-licenses-details.model';
import { ApiService } from '../../core/services/api.service';
import { timeout } from 'rxjs/operators';

interface ApprovedLicenceCertificateItem {
  licenceApplicationID: number;
  applicationNumber: string;
  financialYear: string;
  licenceNumber: string;
  applicantName: string;
  tradeName: string;
  tradeAddress: string;
  tradeMajorName: string;
  tradeMinorName: string;
  tradeSubName: string;
  licenceFromDate: string;
  licenceToDate: string;
  receiptNumber: string;
  receiptDate: string;
  tradeFee: number;
  wardID?: number;
  wardName?: string;
  applicationStatus: string;
}

interface LicenceCertificateViewModel {
  wardName: string;
  licenceNo: string;
  applicationNo: string;
  financialYear: string;
  applicantName: string;
  licenceDate: string;
  tradeName: string;
  tradeAddress: string;
  sanctionedPower: string;
  majorTrade: string;
  minorTrade: string;
  subTrade: string;
  validUpto: string;
  feesPaid: string;
  paymentMode: string;
  receiptNo: string;
  paymentDate: string;
  renewBefore: string;
  qrCodeOrCertificateHash: string;
}

@Component({
  selector: 'app-licence-certificate',
  imports: [CommonModule, RouterModule, LicenceTemplate],
  templateUrl: './licence-certificate.html',
  styleUrl: './licence-certificate.css',
  encapsulation: ViewEncapsulation.None,
})
export class LicenceCertificate {
  private static readonly CERT_CACHE_PREFIX = 'licence-cert:';
  private static readonly APP_NO_CACHE_PREFIX = 'licence-appno:';

  loading = true;
  errorMessage = '';
  licenceApplicationId: number | null = null;

  viewModel: LicenceCertificateViewModel = {
    wardName: '-',
    licenceNo: '-',
    applicationNo: '-',
    financialYear: '-',
    applicantName: '-',
    licenceDate: '-',
    tradeName: '-',
    tradeAddress: '-',
    sanctionedPower: '-',
    majorTrade: '-',
    minorTrade: '-',
    subTrade: '-',
    validUpto: '-',
    feesPaid: '-',
    paymentMode: '-',
    receiptNo: '-',
    paymentDate: '-',
    renewBefore: '-',
    qrCodeOrCertificateHash: '-',
  };

  constructor(
    private route: ActivatedRoute,
    private inspectionService: InspectionService,
    private api: ApiService,
    private router: Router
  ) {}

  private from = '';

  ngOnInit(): void {
    const rawParam = this.route.snapshot.paramMap.get('licensesApplicationId') ?? '';
    this.from = this.route.snapshot.queryParamMap.get('from') ?? '';
    const appNoFromQuery = (this.route.snapshot.queryParamMap.get('applicationNumber') ?? '').trim();
    const refId = this.route.snapshot.queryParamMap.get('licenceApplicationId') ?? '';
    const parsedId = Number(refId);
    if (Number.isFinite(parsedId) && parsedId > 0) {
      this.licenceApplicationId = parsedId;
    }
    if (!rawParam) {
      this.loading = false;
      this.errorMessage = 'Invalid application id.';
      return;
    }

    const asNumber = Number(rawParam);
    const isNumericId = Number.isFinite(asNumber) && asNumber > 0 && rawParam.trim() === asNumber.toString();

    if (appNoFromQuery) {
      if (this.licenceApplicationId) {
        this.cacheApplicationNumber(this.licenceApplicationId, appNoFromQuery);
      }
      this.loadCertificateByApplicationNo(appNoFromQuery, true);
      return;
    }

    if (isNumericId) {
      this.licenceApplicationId = asNumber;
      const cachedAppNo = this.getCachedApplicationNumber(asNumber);
      if (cachedAppNo) {
        this.loadCertificateByApplicationNo(cachedAppNo, true);
        return;
      }
      this.resolveApplicationNumberFromId(asNumber);
    } else {
      this.licenceApplicationId = null;
      this.loadCertificateByApplicationNo(rawParam, true);
    }
  }

  printCertificate(): void {
    this.triggerPrintDialog();
  }

  downloadPdf(): void {
    if (typeof document === 'undefined') {
      this.triggerPrintDialog();
      return;
    }
    const previousTitle = document.title;
    const safeLicenceNo = (this.viewModel.licenceNo || 'certificate').replace(/[^a-z0-9-_]/gi, '_');
    document.title = `Licence_${safeLicenceNo}`;
    this.triggerPrintDialog(() => {
      document.title = previousTitle;
    });
  }

  @HostListener('window:afterprint')
  onAfterPrint(): void {
    this.setPrintMode(false);
  }

  goBack(): void {
    if (this.from === 'admin' && this.licenceApplicationId) {
      this.router.navigate(['/admin/licence-applications', this.licenceApplicationId]);
      return;
    }
    if (this.licenceApplicationId) {
      this.router.navigate(['/trader/view-licenses-application', this.licenceApplicationId]);
      return;
    }
    this.router.navigate(['/admin/licence-applications']);
  }

  private resolveApplicationNumberFromId(licenceApplicationId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.inspectionService
      .getlicenceApplicationDetails(licenceApplicationId)
      .pipe(timeout(10000))
      .subscribe({
      next: (application: LicenceApplicationModel) => {
        if (!application?.applicationNumber) {
          this.loading = false;
          this.errorMessage = 'Application number not found for this id.';
          return;
        }

        this.cacheApplicationNumber(licenceApplicationId, application.applicationNumber);
        this.loadCertificateByApplicationNo(application.applicationNumber, true);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load licence application details.';
      }
    });
  }

  private loadCertificateByApplicationNo(applicationNo: string, useCache: boolean): void {
    this.loading = true;
    this.errorMessage = '';
    const normalizedAppNo = (applicationNo ?? '').trim();
    if (!normalizedAppNo) {
      this.loading = false;
      this.errorMessage = 'Invalid application number.';
      return;
    }

    if (useCache) {
      const cachedRecord = this.getCachedCertificate(normalizedAppNo);
      if (cachedRecord) {
        this.viewModel = this.buildViewModelFromCertificate(cachedRecord);
        this.loading = false;
      }
    }

    this.api
      .get<ApprovedLicenceCertificateItem[]>(`/licence/certificate/approved/${normalizedAppNo}`)
      .pipe(timeout(10000))
      .subscribe({
        next: (items) => {
          const record = items?.[0];
          if (!record) {
            if (this.loading) {
              this.loading = false;
              this.errorMessage = 'No approved licence certificate found.';
            }
            return;
          }

          this.cacheCertificate(record);
          if (this.licenceApplicationId && record.applicationNumber) {
            this.cacheApplicationNumber(this.licenceApplicationId, record.applicationNumber);
          }
          this.viewModel = this.buildViewModelFromCertificate(record);
          this.loading = false;
          this.errorMessage = '';
        },
        error: () => {
          if (this.loading) {
            this.loading = false;
            this.errorMessage = 'Unable to load approved licence certificate.';
          }
        }
      });
  }

  private cacheCertificate(record: ApprovedLicenceCertificateItem): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    const applicationNo = (record?.applicationNumber ?? '').trim();
    if (!applicationNo) {
      return;
    }
    sessionStorage.setItem(
      `${LicenceCertificate.CERT_CACHE_PREFIX}${applicationNo}`,
      JSON.stringify(record)
    );
  }

  private getCachedCertificate(applicationNo: string): ApprovedLicenceCertificateItem | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    const raw = sessionStorage.getItem(
      `${LicenceCertificate.CERT_CACHE_PREFIX}${applicationNo}`
    );
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as ApprovedLicenceCertificateItem;
    } catch {
      return null;
    }
  }

  private cacheApplicationNumber(licenceApplicationId: number, applicationNo: string): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    const normalized = (applicationNo ?? '').trim();
    if (!normalized) {
      return;
    }
    sessionStorage.setItem(
      `${LicenceCertificate.APP_NO_CACHE_PREFIX}${licenceApplicationId}`,
      normalized
    );
  }

  private getCachedApplicationNumber(licenceApplicationId: number): string | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    return sessionStorage.getItem(
      `${LicenceCertificate.APP_NO_CACHE_PREFIX}${licenceApplicationId}`
    );
  }

  private buildViewModelFromCertificate(
    record: ApprovedLicenceCertificateItem
  ): LicenceCertificateViewModel {
    return {
      wardName: record.wardName || (record.wardID ? `Ward ${record.wardID}` : '-'),
      licenceNo: record.licenceNumber || '-',
      applicationNo: record.applicationNumber || '-',
      financialYear: record.financialYear || '-',
      applicantName: record.applicantName || '-',
      licenceDate: this.formatDate(record.licenceFromDate),
      tradeName: record.tradeName || '-',
      tradeAddress: record.tradeAddress || '-',
      sanctionedPower: '-',
      majorTrade: record.tradeMajorName || '-',
      minorTrade: record.tradeMinorName || '-',
      subTrade: record.tradeSubName || '-',
      validUpto: this.formatDate(record.licenceToDate),
      feesPaid: record.tradeFee ? record.tradeFee.toString() : '-',
      paymentMode: '-',
      receiptNo: record.receiptNumber || '-',
      paymentDate: this.formatDate(record.receiptDate),
      renewBefore: this.formatDate(record.licenceToDate),
      qrCodeOrCertificateHash: record.applicationNumber || '-',
    };
  }

  private formatDate(value?: string | Date | null): string {
    if (!value) {
      return '-';
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private setPrintMode(enabled: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.classList.toggle('is-printing', enabled);
  }

  private triggerPrintDialog(onComplete?: () => void): void {
    this.setPrintMode(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        this.setPrintMode(false);
        onComplete?.();
      }, 0);
    }, 0);
  }
}
