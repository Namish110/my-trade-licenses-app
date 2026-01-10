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

  isLogin = false;
  showPassword = false;
  email = '';
  password = '';
  constructor(private router: Router, private auth: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    const payload = {
      usernameOrPhone: this.email,
      password: this.password
    };

    this.auth.login(payload).subscribe({
    next: () => {
        //write a logic to redirect based on role
        this.router.navigate(['/senior-approver']);
      },
      error: (err) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}


