import { NotificationService, Notification } from './notification.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class NotificationComponent {

  notification: Notification | null = null;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.notificationService.notification$.subscribe(data => {

      this.notification = null;
      this.cdr.detectChanges(); // 👈 force UI sync

      setTimeout(() => {
        this.notification = data;
        this.cdr.detectChanges(); // 👈 update UI immediately

        setTimeout(() => {
          this.notification = null;
          this.cdr.detectChanges(); // 👈 remove after 5 sec
        }, 5000);

      }, 0);
    });
  }
}