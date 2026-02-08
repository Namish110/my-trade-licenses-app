import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-licenses-application',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-licenses-application.html',
  styleUrl: './view-licenses-application.css',
})
export class ViewLicensesApplication {
  licenceApplicationId = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.licenceApplicationId = this.route.snapshot.paramMap.get('licensesApplicationId') ?? '';
  }
}
