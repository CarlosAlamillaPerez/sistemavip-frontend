import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'servicios',
        loadChildren: () => import('./features/servicios/servicios.routes').then(m => m.SERVICIOS_ROUTES)
      },
      {
        path: 'personal',
        loadChildren: () => import('./features/personal/personal.routes').then(m => m.PERSONAL_ROUTES)
      },
      {
        path: 'blacklist',
        loadChildren: () => import('./features/blacklist/blacklist.routes').then(m => m.BLACKLIST_ROUTES)
      },
      {
        path: '',
        redirectTo: 'servicios',
        pathMatch: 'full'
      }
    ]
  }
];