import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateAccount } from '../create-account/create-account';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import e from 'express';

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
  constructor(private router: Router, private auth: AuthService, private tokenService: TokenService) {}

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
        // 🔥 Extract UserId from JWT
        const userId = this.tokenService.getUserId(); // number
        const role = this.tokenService.getRole(); // string
        if(role === 'admin'){
          //write a logic to redirect based on role
          this.router.navigate(['/admin']);  //approver,trader,admin, senior-approver
        }else if(role === 'trader'){
          this.router.navigate(['/trader']);
        }else if(role === 'approver'){
          this.router.navigate(['/approver']);
        }else if(role === 'seniorapprover'){
          this.router.navigate(['/senior-approver']);
        }else{
          alert('Invalid credentials');
          return;
        }
      },
      error: (err) => {
        alert('Invalid credentials');
        console.error(err);
      }
    });
  }
}


