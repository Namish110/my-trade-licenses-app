import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PortalAdminService } from './portal-admin.service';
import { TokenService } from '../../core/services/token.service';
import { PortalAdminModel } from '../../core/models/portal-admin.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-portal-admin',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-admin.html',
  styleUrl: './portal-admin.css',
})
export class PortalAdmin {
  
  statusCount: any;
  userId: number | null = null;

  statusMap: Record<string, number> = {
    APPLIED: 0,
    APPROVED: 0,
    INSPECTED: 0,
    REJECTED: 0
  };

  //dashboard model
  portalAdminDetailsCount:  PortalAdminModel[]= [];
  constructor(
  private portalAdminService: PortalAdminService,
  private tokenService: TokenService,
  private cdr: ChangeDetectorRef
) {}

  //Checkeing if the user is portal - admin or not if portal - admin then loading the details from autofetch.
  ngOnInit(): void {
    const id = this.tokenService.getUserId();

    //console.log('Decoded userId:', id);

    if (id !== null) {
      this.userId = id;
      this.dashboardDataLoad(); // 
    } else {
      //console.warn('UserId not available yet');
    }
  }



  loadStatusCount() {
    if (this.userId === null) {
      //console.warn('UserId is null, API call skipped');
      return;
    }
    this.portalAdminService
      .getApplicationStatusCount(this.userId)
      .subscribe({
        next: (res) => {
          this.statusCount = res;
          //console.log('Application Status Count:', this.statusCount);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  dashboardDataLoad(): void {
    if (this.userId === null) return;

    const url = `/dashboard/application-status-count/${this.userId}`;

    this.portalAdminService.getAdminStatusCount(url).subscribe({
      next: (response) => {
        const tempMap: Record<string, number> = {
          APPLIED: 0,
          APPROVED: 0,
          INSPECTED: 0,
          REJECTED: 0
        };

        response.forEach(item => {
          const key = item.licenceApplicationStatusName
            ?.trim()
            .toUpperCase();

          if (key && key in tempMap) {
            tempMap[key] = item.totalApplications;
          }
        });

        this.statusMap = { ...tempMap };
        //console.log('cdr is', this.cdr);
        // 🔥 FORCE UI UPDATE
        this.cdr.detectChanges();
        //console.log('Final statusMap:', this.statusMap);
      }
    });
  }

}
