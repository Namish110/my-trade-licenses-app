import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateAccount } from '../create-account/create-account';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule], //CreateAccount
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  isLogin = true;
  showPassword = false;
  email = '';
  password = '';
  username = '';
  phone = '';

  constructor(private router: Router, private auth: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  //We need to check the Authorization in backend and redirect the user accordingly 
  // onSubmit() {
  //   if (this.isLogin) {
  //     alert('Login Successful\nWelcome to GBA Trade License Portal');
  //     this.router.navigate(['/dashboard-layout']);
  //   } else {
  //     alert('Registration Successful\nPlease check your email to verify your account');
  //   }
  // }

  onSubmit() {
    const payload = {
      username: this.username,
      password: this.password
    };

    this.auth.login(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => alert('Invalid credentials')
    });
  }

}
