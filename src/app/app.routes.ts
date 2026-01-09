import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PortalAdmin } from './pages/portal-admin/portal-admin';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { ReportsDashboard } from './layout/reports-dashboard/reports-dashboard';
import { UsersRoles } from './pages/users-roles/users-roles';
import { SystemSettings } from './pages/system-settings/system-settings';
import { MasterDataCompliance } from './pages/master-data-compliance/master-data-compliance';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'admin',
    component: DashboardLayout,
    children: [

      // DEFAULT PAGE inside dashboard
      { path: '', component: PortalAdmin },

      // OTHER PAGES
      { path: 'portal-admin', component: PortalAdmin },
      { path: 'reports', component: ReportsDashboard },
      { path: 'user-roles', component: UsersRoles },
      { path: 'system-settings', component: SystemSettings },
      { path: 'master-data-compliance', component: MasterDataCompliance }

    ]
  },

  // HOME PAGE
  

    //Example to implement the AuthGuard
    // {
    //   path: 'dashboard',
    //   canActivate: [AuthGuard],
    //   loadComponent: () =>
    //     import('./pages/dashboard/dashboard.component')
    //       .then(m => m.DashboardComponent)
    // }

    {
      path: 'login',
      loadComponent: () => import('./pages/login/login')
        .then(m => m.Login)
    },
    {
      path: 'approving-officer',
      loadComponent: () => import('./pages/approving-officer/approving-officer')
        .then(m => m.ApprovingOfficer)
    },
    {
      path: 'business-owner',
      loadComponent: () => import('./pages/business-owner/business-owner')
        .then(m => m.BusinessOwner)
    },
    {
      path: 'new-licenses',
      loadComponent: () => import('./pages/new-licenses/new-licenses')
        .then(m => m.NewLicenses)
    },
    {
      path: 'support',
      loadComponent: () => import('./pages/support/support')
        .then(m => m.Support)
    },
    {
      path: 'track-application',
      loadComponent: () => import('./pages/track-application/track-application')
        .then(m => m.TrackApplication)
    },
    {
      path: 'trader-licenses',
      loadComponent: () => import('./pages/trader-licenses/trader-licenses')
        .then(m => m.TraderLicenses)
    },
    {
      path: 'dashboard',
      loadComponent: () => import('./pages/dashboard/dashboard')
        .then(m => m.Dashboard)
    },
    {
      path: 'dashboard-layout',
      loadComponent: () => import('./layout/dashboard-layout/dashboard-layout')
        .then(m => m.DashboardLayout)
    },
    {
      path: 'create-account',
      loadComponent: () => import('./pages/create-account/create-account')
        .then(m => m.CreateAccount)
    },
    {
      path: 'license-registration',
      loadComponent: () => import('./pages/trade-license-registration/trade-license-registration')
        .then(m => m.TradeLicenseRegistration)
    },
    {
      path: 'senior-approving-officer',
      loadComponent: () => import('./pages/senior-approving-officer/senior-approving-officer')
        .then(m => m.SeniorApprovingOfficer)
    },
    {
      path: 'approver-renewal-list',
      loadComponent: () => import('./pages/approver-renewal-list/approver-renewal-list')
        .then(m => m.ApproverRenewalList)
    },
    {
      path: 'renew-license',
      loadComponent: () => import('./pages/renew-license/renew-license')
        .then(m => m.RenewLicense)
    },
    {
      path: 'renewal-status',
      loadComponent: () => import('./pages/renewal-status/renewal-status')
        .then(m => m.RenewalStatus)
    },
    // {
    //   path: 'user-roles',
    //   loadComponent: () => import('./pages/users-roles/users-roles')
    //     .then(m => m.UsersRoles)
    // },
    // {
    //   path: 'reports-dashboard',
    //   loadComponent: () => import('./layout/reports-dashboard/reports-dashboard')
    //     .then(m => m.ReportsDashboard)
    // },
    // {
    //   path: 'portal-admin',
    //   loadComponent: () => import('./pages/portal-admin/portal-admin')
    //     .then(m => m.PortalAdmin)
    // },
    { path: '**', redirectTo: '' }
];
