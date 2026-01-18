import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateAccountService } from './create-account.service';

@Component({
  selector: 'app-create-account',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {
   email = '';
   password = '';
   name = '';
   phone = '';
   otpSent = false;
   otpVerified = false;

   constructor(private router: Router, private createAccountService: CreateAccountService) {}

   ngOnInit(): void {
    this.otpSent = false;
  }

  onRegister(){

  }
  onSubmit(){

  }
  sendOTP(){
    this.otpSent = true; 
    this.otpVerified = false;
    this.createAccountService.sendOtp(this.phone).subscribe({
      next: res => {
        if(res.success){
          alert('OTP sent successfully');
        }
        else{
          alert('Failed to send OTP');
        }
      }
    });
  }

  verifyOTP(enteredOtp: string) {
    // call verify OTP API
    // assume success
    this.createAccountService.verifyOtp(this.phone, enteredOtp).subscribe({
      next: res => {
        if(res.success){
          this.otpVerified = true;
        }
        else{
          alert('Failed to verify OTP');
          this.otpVerified = false;
        }
      }
    });
  }
}
