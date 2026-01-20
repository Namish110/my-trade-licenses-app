import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService } from './inspection.service';
import { TradeLicenceApplicationModel } from '../../core/models/trade-licenses-details.model';
import { NotificationService } from '../../shared/components/notification/notification.service';

@Component({
  selector: 'app-inspection',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inspection.html',
  styleUrl: './inspection.css',
})
export class Inspection {

  applicationNo: number | null = null;
  tradeLicensesApllication : any;

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
    private insepectionservice : InspectionService,
    private notificationservice: NotificationService
  ) {}

  ngOnInit(): void {
    this.onTradeLicensesIdLoad();
  }

  onTradeLicensesIdLoad(): void {
    const param = this.route.snapshot.paramMap.get('applicationNo');

    this.applicationNo = param !== null ? Number(param) : null;

    if (this.applicationNo !== null && !isNaN(this.applicationNo)) {
      this.getTradeLicensesApplication();
    } else {
      console.error('Invalid application number in route');
    }
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
    this.notificationservice.show('Inspection submitted', 'success');
    this.router.navigate(['/approver/approving-officer']);
  }

  cancel() {
    this.router.navigate(['/approver/approving-officer']);
  }

  getTradeLicensesApplication(): void {
    if (this.applicationNo === null) {
      this.notificationservice.show('Application number is null', 'warning');
      return;
    }

    this.insepectionservice
    .getTradeLicensesApplication(this.applicationNo)
    .subscribe({
      next: (res) => {
        this.tradeLicensesApllication = res;
        console.log(this.tradeLicensesApllication);
      },
      error: (err) => {
        this.notificationservice.show('Internal server error', 'warning');
      }
    });
  }

}
