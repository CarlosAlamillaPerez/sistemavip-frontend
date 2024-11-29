import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'personal',
        loadComponent: () => import('./personal/personal.component').then(m => m.PersonalComponent)
      },
      {
        path: 'comisiones',
        loadComponent: () => import('./comisiones/comisiones.component').then(m => m.ComisionesComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];