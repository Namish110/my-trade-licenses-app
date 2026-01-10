import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-revenue-collection',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './revenue-collection.html',
  styleUrl: './revenue-collection.css',
})
export class RevenueCollection {
  constructor(private router: Router){}

}
