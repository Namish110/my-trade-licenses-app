import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inspection',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inspection.html',
  styleUrl: './inspection.css',
})
export class Inspection {
  applicationNo!: string;

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationNo = this.route.snapshot.paramMap.get('applicationNo')!;
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
    this.router.navigate(['/approver/approving-officer']);
  }

  cancel() {
    this.router.navigate(['/approver/approving-officer']);
  }
}
