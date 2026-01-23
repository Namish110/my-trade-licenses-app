import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/token.service';



type SearchResult = 'found' | 'not_found' | null;
@Component({
  selector: 'app-track-application',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './track-application.html',
  styleUrls: ['./track-application.css'],
})

export class TrackApplication {

  isUser = false;

  constructor(
    private tokenservice: TokenService
  ){}

  ngOnInit(){
    const role = this.tokenservice.getUserRole();
    console.log(role);
    if(role == 'TRADE_OWNER'){
      this.isUser = true;
    }
  }

  applicationId: string = '';
  searchResult: SearchResult = null;
  loading = false;

  applicationData = {
    id: 'APP-2024-005678',
    tradeName: 'Sharma Textiles',
    type: 'Retail - Clothing',
    applicantName: 'Rajesh Sharma',
    submittedOn: '05 Dec 2024',
    address: '45, Brigade Road, Bengaluru - 560025',
    currentStatus: 'inspection_scheduled',
    timeline: [
      { status: 'submitted', label: 'Application Submitted', date: '05 Dec 2024, 10:30 AM', completed: true },
      { status: 'payment', label: 'Payment Confirmed', date: '05 Dec 2024, 10:35 AM', completed: true },
      { status: 'provisional', label: 'Provisional License Issued', date: '05 Dec 2024, 10:36 AM', completed: true },
      { status: 'assigned', label: 'Assigned to Inspector', date: '06 Dec 2024, 09:00 AM', completed: true },
      { status: 'inspection', label: 'Inspection Scheduled', date: '15 Dec 2024, 11:00 AM', completed: false, current: true },
      { status: 'review', label: 'Under Review', date: '', completed: false },
      { status: 'approved', label: 'License Approved', date: '', completed: false }
    ]
  };

  onSearch() {
    this.loading = true;
    if (this.applicationId.trim()) {
      // later replace with API call
      this.searchResult = 'found';
    }
  }

  resetSearch() {
    this.searchResult = null;
    this.applicationId = '';
  }
}
