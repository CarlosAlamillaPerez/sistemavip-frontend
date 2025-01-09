// src/app/features/admin/personal/presentadores/presentadores.routes.ts

import { Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { ListaPresentadoresComponent } from './lista-presentadores/lista-presentadores.component';
import { DetallePresentadorComponent } from './detalle-presentador/detalle-presentador.component';
import { FormPresentadorComponent } from './form-presentador/form-presentador.component';

export const PRESENTADORES_ROUTES: Routes = [
  {
    path: '',
    component: ListaPresentadoresComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'nuevo',
    component: FormPresentadorComponent,
    canActivate: [AdminGuard],
    data: { requireSuperAdmin: true }
  },
  {
    path: 'editar/:id',
    component: FormPresentadorComponent,
    canActivate: [AdminGuard],
    data: { requireSuperAdmin: true }
  },
  {
    path: ':id',
    component: DetallePresentadorComponent,
    canActivate: [AdminGuard]
  }
];