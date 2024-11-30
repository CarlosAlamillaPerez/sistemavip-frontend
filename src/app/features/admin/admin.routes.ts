import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';
import { RoleGuard } from '@core/guards/role.guard';
import { UserRole } from '@core/interfaces/user.interface';

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
        children: [
          {
            path: '',
            loadComponent: () => import('./personal/personal.component').then(m => m.PersonalComponent)
          },
          {
            path: 'presentadores',
            loadChildren: () => import('./personal/presentadores/presentadores.routes')
              .then(m => m.PRESENTADORES_ROUTES),
            canActivate: [RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])]
          }
        ]
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