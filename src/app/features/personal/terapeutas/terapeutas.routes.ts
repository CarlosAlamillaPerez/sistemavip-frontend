import { Routes } from '@angular/router';
import { UserRole } from '@core/interfaces/user.interface';
import { RoleGuard } from '@core/guards/role.guard';

export const TERAPEUTAS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/lista-terapeutas/lista-terapeutas.component')
          .then(m => m.ListaTerapeutasComponent),
        title: 'Lista de Terapeutas'
      },
      {
        path: 'nuevo',
        loadComponent: () => 
          import('./pages/form-terapeuta/form-terapeuta.component')
          .then(m => m.FormTerapeutaComponent),
        title: 'Nuevo Terapeuta',
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN])]
      },
      {
        path: 'editar/:id',
        loadComponent: () => 
          import('./pages/form-terapeuta/form-terapeuta.component')
          .then(m => m.FormTerapeutaComponent),
        title: 'Editar Terapeuta'
      }
    ]
  }
];