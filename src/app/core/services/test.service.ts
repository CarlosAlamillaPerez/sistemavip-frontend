import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, lastValueFrom } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  testLoading(): Observable<any> {
    console.log('TestService: Iniciando request');
    this.loadingService.setLoading(true);

    return new Observable((observer) => {
      console.log('TestService: Iniciando temporizador de 5 segundos');

      const timer = setTimeout(async () => {
        try {
          console.log('TestService: 5 segundos completados, realizando petición HTTP');
          const response = await lastValueFrom(
            this.http.get('https://jsonplaceholder.typicode.com/todos/1')
          );

          observer.next(response);
          observer.complete();
        } catch (error) {
          observer.error(error);
        } finally {
          console.log('TestService: Finalizando después de 5 segundos');
          this.loadingService.setLoading(false);
        }
      }, 5000);

      // Cleanup en caso de que el observable sea cancelado
      return () => {
        clearTimeout(timer);
        this.loadingService.setLoading(false);
      };
    });
  }

  // Nuevo método para probar errores HTTP
  testError(errorType: 'unauthorized' | 'notFound' | 'serverError'): Observable<any> {

    const errorUrls = {
        unauthorized: 'https://httpstat.us/401',
        notFound: 'https://httpstat.us/404',
        serverError: 'https://httpstat.us/500'
      };
    
      return this.http.get(errorUrls[errorType]);
  }
}
