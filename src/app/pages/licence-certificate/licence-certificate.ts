import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LicenceTemplate } from '../../shared/components/licence-template/licence-template';
import { InspectionService } from '../inspection/inspection.service';
import { LicenceApplicationModel } from '../../core/models/trade-licenses-details.model';
import { ApiService } from '../../core/services/api.service';

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
    private api: ApiService
  ) {}

  ngOnInit(): void {
    const rawParam = this.route.snapshot.paramMap.get('licensesApplicationId') ?? '';
    if (!rawParam) {
      this.loading = false;
      this.errorMessage = 'Invalid application id.';
      return;
    }

    const asNumber = Number(rawParam);
    const isNumericId = Number.isFinite(asNumber) && asNumber > 0 && rawParam.trim() === asNumber.toString();

    if (isNumericId) {
      this.licenceApplicationId = asNumber;
      this.resolveApplicationNumberFromId(asNumber);
    } else {
      this.licenceApplicationId = null;
      this.loadCertificateByApplicationNo(rawParam);
    }
  }

  printCertificate(): void {
    window.print();
  }

  downloadPdf(): void {
    window.print();
  }

  private resolveApplicationNumberFromId(licenceApplicationId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.inspectionService.getlicenceApplicationDetails(licenceApplicationId).subscribe({
      next: (application: LicenceApplicationModel) => {
        if (!application?.applicationNumber) {
          this.loading = false;
          this.errorMessage = 'Application number not found for this id.';
          return;
        }

        this.loadCertificateByApplicationNo(application.applicationNumber);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load licence application details.';
      }
    });
  }

  private loadCertificateByApplicationNo(applicationNo: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.api
      .get<ApprovedLicenceCertificateItem[]>(`/licence/certificate/approved/${applicationNo}`)
      .subscribe({
        next: (items) => {
          const record = items?.[0];
          if (!record) {
            this.loading = false;
            this.errorMessage = 'No approved licence certificate found.';
            return;
          }

          this.viewModel = this.buildViewModelFromCertificate(record);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load approved licence certificate.';
        }
      });
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
}
