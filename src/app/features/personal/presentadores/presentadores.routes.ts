import { Routes } from '@angular/router';
import { UserRole } from '@core/interfaces/user.interface';
import { RoleGuard } from '@core/guards/role.guard';

export const PRESENTADORES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/lista-presentadores/lista-presentadores.component')
          .then(m => m.ListaPresentadoresComponent),
        title: 'Lista de Presentadores'
      },
      {
        path: 'nuevo',
        loadComponent: () => 
          import('./pages/form-presentador/form-presentador.component')
          .then(m => m.FormPresentadorComponent),
        title: 'Nuevo Presentador',
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN])]
      },
      {
        path: 'editar/:id',
        loadComponent: () => 
          import('./pages/form-presentador/form-presentador.component')
          .then(m => m.FormPresentadorComponent),
        title: 'Editar Presentador'
      }
    ]
  }
];