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
        path: 'presentadores',
        loadChildren: () => import('./personal/presentadores/pages/presentadores.routes')
          .then(m => m.PRESENTADORES_ROUTES),
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN])]
      },
      {
        path: '',
        redirectTo: 'presentadores',
        pathMatch: 'full'
      }
    ]
  }

];