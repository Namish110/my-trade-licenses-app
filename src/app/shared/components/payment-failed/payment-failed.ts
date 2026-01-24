import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment-failed.html',
  styleUrl: './payment-failed.css',
})
export class PaymentFailed {
   txnId = '';
  errorMsg = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.txnId = params['txnid'];
      this.errorMsg = params['error'] || 'Payment was not completed';
    });
  }

  retryPayment() {
    this.router.navigate(['/trade-license/payment']);
  }

  goBack() {
    this.router.navigate(['/trade']);
  }

}
