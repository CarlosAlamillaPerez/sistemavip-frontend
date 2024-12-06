import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  TerapeutaPresentador,
  TerapeutaPorPresentador,
  AsignarTerapeutaPresentadorRequest,
  CambioEstadoAsignacionRequest,
  EstadoAsignacion
} from '@core/interfaces/terapeuta-presentador.interface';

@Injectable({
  providedIn: 'root'
})
export class TerapeutaPresentadorService {
  private readonly apiUrl = `${environment.apiUrl}/terapeutaspresentadores`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TerapeutaPresentador[]> {
    return this.http.get<TerapeutaPresentador[]>(this.apiUrl);
  }

  getTerapeutasByPresentador(presentadorId: number): Observable<TerapeutaPorPresentador[]> {
    return this.http.get<TerapeutaPorPresentador[]>(`${this.apiUrl}/presentador/${presentadorId}`);
  }

  asignar(data: AsignarTerapeutaPresentadorRequest): Observable<TerapeutaPresentador> {
    return this.http.post<TerapeutaPresentador>(this.apiUrl, data);
  }

  cambiarEstado(
    terapeutaId: number, 
    presentadorId: number, 
    cambioEstado: CambioEstadoAsignacionRequest
  ): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${terapeutaId}/${presentadorId}/estado`,
      cambioEstado,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Método helper para validar asignaciones
  validarAsignacion(terapeutaId: number, presentadorId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/validar/${terapeutaId}/${presentadorId}`
    );
  }
}