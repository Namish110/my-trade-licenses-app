import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [

  // HOME PAGE
  { path: '', component: Home },

  // APPLY NEW TRADE LICENSE
  {
    path: 'trader/apply',
    loadComponent: () =>
      import('./pages/trader/apply')
        .then(m => m.Apply)
  },

  // fallback
  { path: '**', redirectTo: '' }
];
