import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    
    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                // Solo redirigir si no estamos ya en la página de login
                if (!router.url.includes('/auth/login')) {
                    router.navigate(['/auth/login']);
                }
            }
            return throwError(() => error);
        })
    );
};