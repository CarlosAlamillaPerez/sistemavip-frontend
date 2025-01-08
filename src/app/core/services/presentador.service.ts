// presentador.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Presentador, 
  CreatePresentadorRequest, 
  UpdatePresentadorRequest,
  CambioEstadoPresentadorRequest,
  UpdateComisionRequest,
  ResumenPresentadorDto,
  EstadoPresentador
} from '@core/interfaces/presentador.interface';

@Injectable({
  providedIn: 'root'
})
export class PresentadorService {
  private readonly apiUrl = `${environment.apiUrl}/presentador`;

  constructor(private http: HttpClient) {}

  // Obtener todos los presentadores (solo admin)
  getAll(): Observable<Presentador[]> {
    return this.http.get<Presentador[]>(this.apiUrl);
  }

  // Obtener solo presentadores activos
  getActivos(): Observable<Presentador[]> {
    return this.http.get<Presentador[]>(`${this.apiUrl}/activos`);
  }

  // Obtener por ID
  getById(id: number): Observable<Presentador> {
    return this.http.get<Presentador>(`${this.apiUrl}/${id}`);
  }

  // Obtener por UserId
  getByUserId(userId: string): Observable<Presentador> {
    return this.http.get<Presentador>(`${this.apiUrl}/user/${userId}`);
  }

  // Crear nuevo presentador (solo super admin)
  create(data: CreatePresentadorRequest): Observable<Presentador> {
    return this.http.post<Presentador>(this.apiUrl, data);
  }

  // Actualizar presentador existente
  update(id: number, data: UpdatePresentadorRequest): Observable<Presentador> {
    return this.http.put<Presentador>(`${this.apiUrl}/${id}`, data);
  }

  // Cambiar estado de presentador (solo super admin)
  cambiarEstado(id: number, cambioEstado: CambioEstadoPresentadorRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/estado`,
      cambioEstado
    );
  }

  // Actualizar comisión (solo super admin)
  updateComision(id: number, data: UpdateComisionRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/comision`,
      data
    );
  }

  // Obtener resumen de presentador
  getResumen(id: number): Observable<ResumenPresentadorDto> {
    return this.http.get<ResumenPresentadorDto>(
      `${this.apiUrl}/${id}/resumen`
    );
  }

  // Validar disponibilidad de email/documento
  validarDisponibilidad(email: string, documento: string): Observable<{ disponible: boolean }> {
    const params = new HttpParams()
      .set('email', email)
      .set('documento', documento);

    return this.http.get<{ disponible: boolean }>(
      `${this.apiUrl}/validar-disponibilidad`,
      { params }
    );
  }
}