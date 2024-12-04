import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private readonly timeoutDuration = 10000; // 10 segundos

  getCurrentPosition(): Observable<GeolocationPosition> {
    if (!navigator.geolocation) {
      return throwError(() => new Error('Geolocalización no disponible en este navegador'));
    }

    return from(
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(this.handleError(error)),
          {
            enableHighAccuracy: true,
            timeout: this.timeoutDuration,
            maximumAge: 0
          }
        );
      })
    ).pipe(
      timeout(this.timeoutDuration),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Tiempo de espera excedido al obtener la ubicación'));
        }
        return throwError(() => error);
      })
    );
  }

  private handleError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Permiso denegado para acceder a la ubicación');
      case error.POSITION_UNAVAILABLE:
        return new Error('Información de ubicación no disponible');
      case error.TIMEOUT:
        return new Error('Tiempo de espera excedido al obtener la ubicación');
      default:
        return new Error('Error desconocido al obtener la ubicación');
    }
  }
}