import { Component, OnInit  } from '@angular/core';
import { MLCConstituency, TradeMajor, TradeMinor, TradeSub, TradeType, Ward, ZoneClassification, Zones } from '../../core/models/new-trade-licenses.model';
import { MasterDataComplianceService } from './master-data-compliance.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

type ModalType =
  | 'MLA'
  | 'WARD'
  | 'TRADE_CATEGORY'
  | 'MAJOR_TRADE'
  | 'MINOR_TRADE'
  | 'SUB_TRADE'
  | 'ZONE'
  | 'ZONE_CLASSIFICATION';


@Component({
  selector: 'app-master-data-compliance',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './master-data-compliance.html',
  styleUrl: './master-data-compliance.css',
  standalone: true,
})
export class MasterDataCompliance {

  activeModal: ModalType | null = null;
  constructor(
    private masterDataComplianceService: MasterDataComplianceService,
    private fb: FormBuilder
  ){}

  ngOnInit() {
    this.loadTradeTypes();
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

    selectedtradeTypes: TradeType | null = null;
    selectedMajor: TradeMajor | null = null;
    selectedMinor: TradeMinor | null = null;
    selectedSub: TradeSub | null = null;
    selectedTradeType: TradeType | null = null;
    selectedMLAConstituency: MLCConstituency | null = null;
    selectedWard: Ward | null = null;
    selectedZone: Zones | null = null;
    selectedZoneClassification: ZoneClassification | null = null;
    
    // Modal flags
    // showMLAModal = false;
    // showWardModal = false;
    // showTradeCategoryModal = false;
    // showMajorTradeModal = false;
    // showMinorTradeModal = false;
    // showSubTradeModal = false;
    // showZoneModal = false;
    // showZoneClassificationModal = false;
    isEditMode = false;

    // Edit flags
    // isEditMLA = false;
    // isEditWard = false;
    // isEditTradeCategory = false;
    // isEditMajorTrade = false;
    // isEditMinorTrade = false;
    // isEditSubTrade = false;
    // isEditZone = false;
    // isEditZoneClassification = false;

    // Forms
    mlaForm!: FormGroup;
    wardForm!: FormGroup;
    tradeCategoryForm!: FormGroup;
    majorTradeForm!: FormGroup;
    minorTradeForm!: FormGroup;
    subTradeForm!: FormGroup;
    zoneForm!: FormGroup;
    zoneClassificationForm!: FormGroup;

  // Modal flags
  openModal(type: ModalType, edit = false) {
    this.activeModal = type;
    this.isEditMode = edit;

    switch (type) {
      case 'MLA':
        this.mlaForm.reset();
        if (edit && this.selectedMLAConstituency) {
          this.mlaForm.patchValue(this.selectedMLAConstituency);
        }
        break;

      case 'TRADE_CATEGORY':
        this.tradeCategoryForm.reset();
        if (edit && this.selectedTradeType) {
          this.tradeCategoryForm.patchValue(this.selectedTradeType);
        }
        break;

      case 'WARD':
        this.wardForm.reset();
        if (this.selectedMLAConstituency) {
          this.wardForm.patchValue({
            mlaId: this.selectedMLAConstituency.constituencyID
          });
        }
        if (edit && this.selectedWard) {
          this.wardForm.patchValue(this.selectedWard);
        }
        break;

      case 'MAJOR_TRADE':
        this.majorTradeForm.reset();
        if (edit && this.selectedMajor) {
          this.majorTradeForm.patchValue(this.selectedMajor);
        }
        break;

      case 'MINOR_TRADE':
        this.minorTradeForm.reset();
        if (this.selectedMajor) {
          this.minorTradeForm.patchValue({
            tradeMajorID: this.selectedMajor.tradeMajorID
          });
        }
        if (edit && this.selectedMinor) {
          this.minorTradeForm.patchValue(this.selectedMinor);
        }
        break;

      case 'SUB_TRADE':
        this.subTradeForm.reset();
        if (this.selectedMinor) {
          this.subTradeForm.patchValue({
            tradeMinorID: this.selectedMinor.tradeMinorID
          });
        }
        if (edit && this.selectedSub) {
          this.subTradeForm.patchValue(this.selectedSub);
        }
        break;

      case 'ZONE':
        this.zoneForm.reset();
        if (edit && this.selectedZone) {
          this.zoneForm.patchValue(this.selectedZone);
        }
        break;

      case 'ZONE_CLASSIFICATION':
        this.zoneClassificationForm.reset();
        if (edit && this.selectedZoneClassification) {
          this.zoneClassificationForm.patchValue(this.selectedZoneClassification);
        }
        break;
    }
  }

  //load Trade Types
  loadTradeTypes(){
    this.masterDataComplianceService.getTradeTypes().subscribe({
      next: (res) => {
        this.tradeTypes = res;
      console.log('Trade Types:', this.tradeTypes);
      },
      error: (err) => console.error(err)
    });
  }

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

  saveModal() {
    switch (this.activeModal) {
      case 'MLA':
        console.log(this.mlaForm.value);
        break;

      case 'WARD':
        console.log(this.wardForm.value);
        break;

      case 'MAJOR_TRADE':
        console.log(this.majorTradeForm.value);
        break;

      case 'MINOR_TRADE':
        console.log(this.minorTradeForm.value);
        break;

      case 'SUB_TRADE':
        console.log(this.subTradeForm.value);
        break;

      case 'ZONE':
        console.log(this.zoneForm.value);
        break;

      case 'ZONE_CLASSIFICATION':
        console.log(this.zoneClassificationForm.value);
        break;

      case 'TRADE_CATEGORY':
        console.log(this.zoneClassificationForm.value);
        break;
    }

    this.activeModal = null;
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
