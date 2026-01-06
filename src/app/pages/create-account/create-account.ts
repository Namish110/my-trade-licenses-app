import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  onRegister(){

  }
  onSubmit(){

  }
}
