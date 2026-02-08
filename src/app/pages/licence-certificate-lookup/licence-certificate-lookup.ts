import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-licence-certificate-lookup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './licence-certificate-lookup.html',
  styleUrl: './licence-certificate-lookup.css',
})
export class LicenceCertificateLookup {
  applicationNumber = '';
  errorMessage = '';

  constructor(private router: Router) {}

  generate(): void {
    const value = this.applicationNumber.trim();
    if (!value) {
      this.errorMessage = 'Please enter an application number.';
      return;
    }

    this.errorMessage = '';
    this.router.navigate(['/trader/licence-certificate', value]);
  }
}
