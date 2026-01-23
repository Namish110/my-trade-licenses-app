import { ChangeDetectorRef, Component } from '@angular/core';
import { TradeType } from '../../core/models/new-trade-licenses.model';
import { NewLicensesService } from '../new-licenses/new-licenses.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApprovingOfficerService } from './approving-officer.service';
import { LicenceApplicationModel } from '../../core/models/trade-licenses-details.model';


declare var bootstrap: any;

@Component({
  selector: 'app-approving-officer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './approving-officer.html',
  styleUrl: './approving-officer.css',
})
export class ApprovingOfficer {

  selectedApplication: number | null = null;
  tradeTypes : TradeType[] = [];

  tradeLicensesApplicationDetails : LicenceApplicationModel[] =[]; 
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;
  pages: number[] = [];
  isLoading = false;

  constructor(private newLicensesService: NewLicensesService,
    private router : Router,
    private approvingofficerService: ApprovingOfficerService,
    private cdr: ChangeDetectorRef
  ){}
  
  selectedTradeType: TradeType | null = null;
  
  selectRow(applicationNo: number) {
    this.selectedApplication = applicationNo;
  }

  ngOnInit(){
    this.loadTradeType();
    this.loadApplications();
  }
  //Load Trade Types
  loadTradeType(){
    this.newLicensesService.getTradeTypes().subscribe({
      next: (res) => {
        this.tradeTypes = res;
      },
      error: (err) => console.error(err)
    });
  }

  onInspectionClick(applicationNo: number) {
    this.selectedApplication = applicationNo;

    this.router.navigate(['/approver/inspection', applicationNo]);
  }

  loadApplications(): void {
    this.isLoading = true;
    this.approvingofficerService
    .getPagedApplications(this.pageNumber, this.pageSize)
    .subscribe({
      next: (res: any) => {
        this.tradeLicensesApplicationDetails = [...(res.data || [])];

        this.totalRecords = res.totalRecords || 0;
        this.totalPages = res.totalPages || 0;

        this.isLoading = false; 
        this.cdr.detectChanges();

        this.generatePages();
      },
      error: () => {
        this.isLoading = false; 
        this.tradeLicensesApplicationDetails = [];
        this.cdr.detectChanges();
      }
    });
  }


  //For pages 
  generatePages() {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.pageNumber - 2);
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    this.pages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

  //OnPageChangeEvent
  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }

    this.pageNumber = page;
    this.loadApplications();
  }

  //Showing details for user
  get showingTo(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }

  //showing from details for user
  get showingFrom(): number {
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

}
