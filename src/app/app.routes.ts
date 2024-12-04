import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/interfaces/user.interface';
import { RoleGuard } from './core/guards/role.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'personal',
    component: UserLayoutComponent,
    canActivate: [AuthGuard, RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])],
    children: [
      {
        path: 'presentadores',
        loadChildren: () => import('./features/personal/presentadores/presentadores.routes')
          .then(m => m.PRESENTADORES_ROUTES)
      },
      {
        path: 'terapeutas',
        loadChildren: () => import('./features/personal/terapeutas/terapeutas.routes')
          .then(m => m.TERAPEUTAS_ROUTES)
      },
      {
        path: 'asignaciones',
        loadChildren: () => import('./features/personal/asignaciones/asignaciones.routes')
          .then(m => m.ASIGNACIONES_ROUTES)
      },
      {
        path: '',
        redirectTo: 'presentadores',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'servicios',
        loadChildren: () => import('./features/servicios/servicios.routes').then(m => m.SERVICIOS_ROUTES)
      },
      // {
      //   path: 'blacklist',
      //   loadChildren: () => import('./features/blacklist/blacklist.routes').then(m => m.BLACKLIST_ROUTES),
      //   canActivate: [RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRESENTADOR])]
      // },
      {
        path: '',
        redirectTo: 'servicios',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];