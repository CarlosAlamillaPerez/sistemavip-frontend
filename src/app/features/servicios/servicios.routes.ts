import { Routes } from '@angular/router';
import { UserRole } from '@core/interfaces/user.interface';
import { RoleGuard } from '@core/guards/role.guard';

export const SERVICIOS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => 
          import('./pages/lista-servicios/lista-servicios.component')
          .then(m => m.ListaServiciosComponent),
        title: 'Servicios'
      },
      {
        path: 'nuevo',
        loadComponent: () => 
          import('./pages/form-servicio/form-servicio.component')
          .then(m => m.FormServicioComponent),
        title: 'Nuevo Servicio',
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRESENTADOR])]
      },
      {
        path: 'editar/:id',
        loadComponent: () => 
          import('./pages/form-servicio/form-servicio.component')
          .then(m => m.FormServicioComponent),
        title: 'Editar Servicio',
        canActivate: [RoleGuard([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRESENTADOR])]
      },
      {
        path: 'seguimiento/:id',
        loadComponent: () => 
          import('./pages/seguimiento-servicio/seguimiento-servicio.component')
          .then(m => m.SeguimientoServicioComponent),
        title: 'Seguimiento de Servicio'
      },
      {
        path: 'confirmar/:linkConfirmacion',
        loadComponent: () => 
          import('./pages/confirmacion-servicio/confirmacion-servicio.component')
          .then(m => m.ConfirmacionServicioComponent),
        title: 'Confirmar Servicio'
      },
      {
        path: 'finalizar/:linkFinalizacion',
        loadComponent: () => 
          import('./pages/finalizacion-servicio/finalizacion-servicio.component')
          .then(m => m.FinalizacionServicioComponent),
        title: 'Finalizar Servicio'
      }
    ]
  }
];