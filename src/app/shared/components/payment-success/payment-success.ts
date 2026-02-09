import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentSuccessService } from './payment-success.service';
import { LoaderService } from '../loader/loader.service';
import { TradeLicenceStateService } from '../../services/trade-licenses-service';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {
  txnId = '';
  amount = '';
  licensesApplicationId = '';
  paymentDate = '';
  email = '';
  phone = '';
  corporationId = 0;

  constructor(private route: ActivatedRoute, private router: Router,
    private paymentSuccessService: PaymentSuccessService,
    private cdr: ChangeDetectorRef,
    private loaderservice: LoaderService,
    private tradeLicenceStateService: TradeLicenceStateService
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.txnId = params['txnid'];
    //   this.amount = params['amount'];
    //   this.applicationNo = params['applicationNumber'];
    //   this.paymentDate = params['addedon'];
    // });
    this.saveApplocation();
    this.route.queryParams.subscribe(params => {
      this.txnId = params['txnid'];
      this.amount = params['amount'];
      this.email = params['email'];
      this.phone = params['phone'];
      this.corporationId = +params['corporationId'];
      this.licensesApplicationId = params['applicationNo'];
    });
  }



  saveApplocation(){
    //To update in TradeLicense details
    this.loaderservice.show();
    const tradeLicenceID = this.tradeLicenceStateService.getTradeLicenceID();
    if(!tradeLicenceID){
      console.log('Trade Licence ID is not available. Cannot save application to Trade License.');
      console.log('Licenses Application ID:', this.licensesApplicationId);
      console.log('Trade Licence State Service:', this.tradeLicenceStateService.getTradeLicenceID());
      this.loaderservice.hide();
      return;
    }
    this.paymentSuccessService.saveApplicationToTradeLicense(tradeLicenceID).subscribe({
      next: (res) => {
        console.log('Application saved to Trade License:', res);    
      },
      error: (err) => {
        console.error('Error saving application to Trade License:', err);
        this.loaderservice.hide(); 
      }
    });
    //To update in LicensesApplication details
    this.loaderservice.show();
    this.paymentSuccessService.saveApplicationToLicensesApp(+this.licensesApplicationId).subscribe({
      next: (res) => {
        console.log('Application submitted to Licence Application:', res); 
        this.loaderservice.hide(); 
      },
      error: (err) => {
        console.error('Error submitting application to Licence Application:', err);
        this.loaderservice.hide(); 
      }
    });
    //To update in payment details  
    this.loaderservice.show();
    this.paymentSuccessService.saveApplicationToTradeLicenseWithPayment(+this.licensesApplicationId).subscribe({
      next: (res) => {
        console.log('Application submitted to Trade License with payment:', res); 
        this.loaderservice.hide(); 
      },
      error: (err) => {
        console.error('Error submitting application to Trade License with payment:', err);
        this.loaderservice.hide(); 
      }
    });
  }

  goToApplication(){
    console.log('working');
    this.router.navigate([
      'trader/view-licenses-application',
      this.licensesApplicationId
    ]);
  }
}
