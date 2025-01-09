import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    
    // Log de la petición para depuración
    console.log('Request URL:', req.url);

    return next(req).pipe(
        catchError((error) => {
            console.log('Error en interceptor:', error.status, req.url);
            
            // Si es un error 404 en la verificación de auth, solo navegamos al login
            if (error.status === 404 && req.url.includes('Auth/check')) {
                router.navigate(['/auth/login']);
                return throwError(() => error);
            }

            // Para otros errores, los propagamos
            return throwError(() => error);
        })
    );
};