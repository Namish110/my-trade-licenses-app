import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-zoneapprover-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './zoneapprover-dashboard.html',
  styleUrl: './zoneapprover-dashboard.css'
})
export class ZoneapproverDashboard {
  kpis = [
    { label: 'Inspected in Queue', value: 32, tone: 'primary' },
    { label: 'Pending Cross Check', value: 11, tone: 'warning' },
    { label: 'Forwarded to Senior', value: 17, tone: 'success' },
    { label: 'Objections Raised', value: 4, tone: 'danger' }
  ];

  zoneSummary = [
    { zone: 'South Zone', pending: 5, forwarded: 6, objections: 1 },
    { zone: 'East Zone', pending: 3, forwarded: 4, objections: 1 },
    { zone: 'West Zone', pending: 2, forwarded: 5, objections: 0 },
    { zone: 'North Zone', pending: 1, forwarded: 2, objections: 2 }
  ];
}
