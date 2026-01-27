import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess {
  txnId = '';
  amount = '';
  applicationNo = '';
  paymentDate = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.txnId = params['txnid'];
      this.amount = params['amount'];
      this.applicationNo = params['applicationNumber'];
      this.paymentDate = params['addedon'];
    });
  }

  goToApplication(){
    console.log('working');
    this.router.navigate([
      'trader/view-licenses-application',
      this.applicationNo
    ]);
  }
}
