import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PortalAdminService } from './portal-admin.service';

@Component({
  selector: 'app-portal-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-admin.html',
  styleUrl: './portal-admin.css',
})
export class PortalAdmin {
  statusCount: any;
  portalAdminId = 5336;
  constructor(private portalAdminService: PortalAdminService) {}

  //Checkeing if the user is portal - admin or not if portal - admin then loading the details from autofetch.
  ngOnInit() {
    this.loadStatusCount();
  }

  loadStatusCount() {
    this.portalAdminService
      .getApplicationStatusCount(this.portalAdminId)
      .subscribe({
        next: (res) => {
          this.statusCount = res;
          console.log('Application Status Count:', this.statusCount);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
