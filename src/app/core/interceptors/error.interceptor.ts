import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ignorar el error 404 específico del check de autenticación
      if (error.status === 404 && req.url.includes('api/Auth/check')) {
        return throwError(() => error);
      }
      
      errorHandler.handleError(error);
      
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/Auth/login']);
      }

      return throwError(() => error);
    })
  );
};