import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ward-wise-licenses',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ward-wise-licenses.html',
  styleUrl: './ward-wise-licenses.css',
})
export class WardWiseLicenses {
  constructor(private router: Router){}

}
