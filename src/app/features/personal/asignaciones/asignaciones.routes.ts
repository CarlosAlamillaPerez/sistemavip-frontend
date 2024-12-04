import { Routes } from '@angular/router';
import { UserRole } from '@core/interfaces/user.interface';
import { RoleGuard } from '@core/guards/role.guard';

export const ASIGNACIONES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/lista-asignaciones/lista-asignaciones.component')
          .then(m => m.ListaAsignacionesComponent),
        title: 'Asignaciones Terapeuta-Presentador'
      },
      {
        path: 'nueva',
        loadComponent: () => 
          import('./pages/form-asignacion/form-asignacion.component')
          .then(m => m.FormAsignacionComponent),
        title: 'Nueva Asignación',
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN])]
      },
      {
        path: 'presentador/:id',
        loadComponent: () => 
          import('./pages/terapeutas-presentador/terapeutas-presentador.component')
          .then(m => m.TerapeutasPresentadorComponent),
        title: 'Terapeutas por Presentador'
      }
    ]
  }
];