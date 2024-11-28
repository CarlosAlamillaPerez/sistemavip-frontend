import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@core/interfaces/user.interface';
import { map, take } from 'rxjs/operators';

export const RoleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/auth/login']);
          return false;
        }

        if (allowedRoles.includes(user.role)) {
          return true;
        }

        router.navigate(['/unauthorized']);
        return false;
      })
    );
  };
};