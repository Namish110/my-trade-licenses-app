import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-renewed-licenses',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './not-renewed-licenses.html',
  styleUrl: './not-renewed-licenses.css',
})
export class NotRenewedLicenses {

  constructor(private router: Router){ }

}
