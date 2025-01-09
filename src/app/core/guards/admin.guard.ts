// src/app/core/guards/admin.guard.ts

import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { UserRole } from '@core/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Obtener el nivel de acceso requerido de los datos de la ruta
    const requireSuperAdmin = route.data['requireSuperAdmin'] === true;

    return this.authService.getCurrentUserRole().pipe(
      map(role => {
        // Si requiere SUPER_ADMIN, solo permitir ese rol
        if (requireSuperAdmin && (role !== UserRole.SUPER_ADMIN && role !== UserRole.ADMIN)) {
          this.alertService.warning(
              'Acceso Denegado', 
              'No tiene permisos suficientes para acceder a esta sección'
          );
          this.router.navigate(['/admin/presentadores']);
          return false;
      }

        // Para otras rutas admin, permitir tanto SUPER_ADMIN como ADMIN
        if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
          return true;
        }

        // Si no tiene ningún rol administrativo
        this.alertService.warning(
          'Acceso Denegado', 
          'No tiene permisos para acceder al panel de administración'
        );
        this.router.navigate(['/Auth/login']);
        return false;
      })
    );
  }
}