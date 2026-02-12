import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApplication } from '../../admin-applications.service';

@Component({
  selector: 'app-admin-application-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-application-table.html',
  styleUrl: './admin-application-table.css'
})
export class AdminApplicationTableComponent {
  @Input() applications: AdminApplication[] = [];
  @Input() isLoading = false;
  @Input() totalRecords = 0;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() viewApplication = new EventEmitter<AdminApplication>();
  @Output() openApplicationDetails = new EventEmitter<AdminApplication>();

  get totalPages(): number {
    const total = Math.ceil(this.totalRecords / this.pageSize);
    return total > 0 ? total : 1;
  }

  get pages(): number[] {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.pageNumber - 2);
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    const pageList: number[] = [];

    for (let page = startPage; page <= endPage; page++) {
      pageList.push(page);
    }

    return pageList;
  }

  get showingFrom(): number {
    if (!this.totalRecords) {
      return 0;
    }
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalRecords);
  }

  onPageSizeChanged(value: number): void {
    if (!Number.isFinite(value) || value <= 0 || value === this.pageSize) {
      return;
    }
    this.pageSizeChange.emit(value);
  }

  onPageChanged(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) {
      return;
    }
    this.pageChange.emit(page);
  }

  onViewClicked(application: AdminApplication): void {
    this.viewApplication.emit(application);
  }

  onRowClicked(application: AdminApplication): void {
    this.openApplicationDetails.emit(application);
  }

  getStatusBadgeClass(statusName: string): string {
    const normalized = statusName?.trim().toUpperCase() ?? '';

    if (normalized === 'APPROVED') {
      return 'badge text-bg-success';
    }
    if (normalized === 'PENDING') {
      return 'badge text-bg-warning text-dark';
    }
    if (normalized === 'REJECTED') {
      return 'badge text-bg-danger';
    }
    return 'badge text-bg-secondary';
  }
}
