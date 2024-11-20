import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
    // Solo para peticiones que no sean de test
    if (!req.url.includes('jsonplaceholder')) {
        const loadingService = inject(LoadingService);
        console.log('Interceptor: Iniciando request normal');
        loadingService.setLoading(true);

        return next(req).pipe(
            finalize(() => {
                console.log('Interceptor: Finalizando request normal');
                loadingService.setLoading(false);
            })
        );
    }

    return next(req);
};