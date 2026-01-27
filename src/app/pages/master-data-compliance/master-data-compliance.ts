import { Component, OnInit  } from '@angular/core';
import { MLCConstituency, TradeMajor, TradeMinor, TradeSub, TradeType, Ward, ZoneClassification, Zones } from '../../core/models/new-trade-licenses.model';
import { MasterDataComplianceService } from './master-data-compliance.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-master-data-compliance',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './master-data-compliance.html',
  styleUrl: './master-data-compliance.css',
})
export class MasterDataCompliance {

  constructor(
    private masterDataComplianceService: MasterDataComplianceService,
    private fb: FormBuilder
  ){}

  ngOnInit() {
    this.loadMLAConstituencies();
    this.initForms();
  }

  initForms() {
    this.mlaForm = this.fb.group({
      constituencyID: [null],
      mohName: ['', Validators.required]
    });

    this.wardForm = this.fb.group({
      wardID: [null],
      wardName: ['', Validators.required],
      mlaId: [null, Validators.required]
    });

    this.tradeCategoryForm = this.fb.group({
      tradeCategoryID: [null],
      tradeCategoryName: ['', Validators.required]
    });

    this.majorTradeForm = this.fb.group({
      tradeMajorID: [null],
      tradeMajorName: ['', Validators.required]
    });

    this.minorTradeForm = this.fb.group({
      tradeMinorID: [null],
      tradeMinorName: ['', Validators.required],
      tradeMajorID: [null, Validators.required]
    });

    this.subTradeForm = this.fb.group({
      tradeSubID: [null],
      tradeSubName: ['', Validators.required],
      tradeMinorID: [null, Validators.required]
    });

    this.zoneForm = this.fb.group({
      zoneID: [null],
      zoneName: ['', Validators.required]
    });

    this.zoneClassificationForm = this.fb.group({
      zonalClassificationID: [null],
      zonalClassificationName: ['', Validators.required]
    });
  }


  //Loading data in dropdowns 
    tradeMajors : TradeMajor[] = [];
    tradeMinors : TradeMinor[] = [];
    tradeSubs : TradeSub[] = [];
    tradeTypes : TradeType[] = [];
    mlaConstituencies : MLCConstituency[] = [];
    wards : Ward[] = [];
    zones : Zones[] = [];
    zoneClassifications : ZoneClassification[] = [];

    selectedMajor: TradeMajor | null = null;
    selectedMinor: TradeMinor | null = null;
    selectedSub: TradeSub | null = null;
    selectedTradeType: TradeType | null = null;
    selectedMLAConstituency: MLCConstituency | null = null;
    selectedWard: Ward | null = null;
    selectedZone: Zones | null = null;
    selectedZoneClassification: ZoneClassification | null = null;
    
    // Modal flags
    showMLAModal = false;
    showWardModal = false;
    showTradeCategoryModal = false;
    showMajorTradeModal = false;
    showMinorTradeModal = false;
    showSubTradeModal = false;
    showZoneModal = false;
    showZoneClassificationModal = false;

    // Edit flags
    isEditMLA = false;
    isEditWard = false;
    isEditTradeCategory = false;
    isEditMajorTrade = false;
    isEditMinorTrade = false;
    isEditSubTrade = false;
    isEditZone = false;
    isEditZoneClassification = false;

    // Forms
    mlaForm!: FormGroup;
    wardForm!: FormGroup;
    tradeCategoryForm!: FormGroup;
    majorTradeForm!: FormGroup;
    minorTradeForm!: FormGroup;
    subTradeForm!: FormGroup;
    zoneForm!: FormGroup;
    zoneClassificationForm!: FormGroup;




  
  //Load MLA Constituencies
  loadMLAConstituencies(){
    this.masterDataComplianceService.getMLAConstituency().subscribe({
      next: (res) => {
        this.mlaConstituencies = res;
      },
      error: (err) => console.error(err)
    });
  }

  //When MLA Constituency changes
  onMLAConstituencyChange(){
    if(!this.selectedMLAConstituency) return;
    this.masterDataComplianceService.getWardsByMLAConstituency(this.selectedMLAConstituency.constituencyID).subscribe({
      next: (res) => {
        this.wards = res;
      },
      error: (err) => console.error(err)
    });
  }

  loadTradeMajors() {
    this.masterDataComplianceService.getTradeMajors().subscribe({
      next: (res) => {
        this.tradeMajors = res;
      },
      error: (err) => console.error(err)
    });
  }

  //When major changes
  onMajorChange() {
    this.selectedMinor = null;
    this.selectedSub = null;
    this.tradeSubs = [];

    if (!this.selectedMajor) return;

    this.masterDataComplianceService
      .getTradeMinorsByMajor(this.selectedMajor.tradeMajorID)
      .subscribe({
        next: (res) => {
          this.tradeMinors = res;
        },
        error: (err) => console.error(err)
      });
  }

  //When minor changes
  onMinorChange() {
    this.selectedSub = null;

    if (!this.selectedMinor) return;

    this.masterDataComplianceService
      .getTradeSubsByMinor(this.selectedMinor.tradeMinorID)
      .subscribe({
        next: (res) => {
          this.tradeSubs = res;
        },
        error: (err) => console.error(err)
      });
  }


  openAddMLAModal() {
    this.isEditMLA = false;
    this.mlaForm.reset();
    this.showMLAModal = true;
  }

  openEditMLAModal() {
    if (!this.selectedMLAConstituency) return;

    this.isEditMLA = true;
    this.mlaForm.patchValue({
      constituencyID: this.selectedMLAConstituency.constituencyID,
      mohName: this.selectedMLAConstituency.mohName
    });
    this.showMLAModal = true;
  }

  openAddWardModal() {
    if (!this.selectedMLAConstituency) return;

    this.isEditWard = false;
    this.wardForm.reset();

    this.wardForm.patchValue({
      mlaId: this.selectedMLAConstituency.constituencyID
    });

    this.showWardModal = true;
  }


  openEditWardModal() {
    if (!this.selectedMLAConstituency || !this.selectedWard) return;

    this.isEditWard = true;
    this.wardForm.patchValue({
      wardID: this.selectedWard.wardID,
      wardName: this.selectedWard.wardName,
      mlaId: this.selectedMLAConstituency.constituencyID
    });

    this.showWardModal = true;
  }

  openAddMajorTradeModal(){

  }
  openAddMinorTradeModal(){

  }
  openAddSubTradeModal(){

  }
  openEditMinorTradeModal(){

  }
  openAddJurisdictionOdHoModal(){

  }

  openAddZoneClassificationModal(){

  }
  openAddTradeCategoriesModal(){
    
  }

  //To Save Trade Classification Details
  tradePrice: number | null = null;
  saveTradePrice(){

  }

  //To Save licenseFeePrescribed
  licenseFeePrescribed: number | null = null;

  saveLicenseFeePrescribed(){

  }
}
