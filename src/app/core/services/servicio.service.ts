import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Servicio,
  CreateServicioRequest,
  UpdateServicioRequest,
  ConfirmacionServicioRequest,
  FinalizacionServicioRequest,
  CancelacionServicioRequest,
  ServicioTerapeuta
} from '@core/interfaces/servicio.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private readonly apiUrl = `${environment.apiUrl}/servicio`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  getById(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateServicioRequest): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, data);
  }

  update(id: number, data: UpdateServicioRequest): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${id}`, data);
  }

  cancelar(id: number, data: CancelacionServicioRequest): Observable<Servicio> {
    return this.http.post<Servicio>(`${this.apiUrl}/${id}/cancelar`, data);
  }

  getServicioTerapeutaByLinkConfirmacion(linkConfirmacion: string): Observable<ServicioTerapeuta> {
    return this.http.get<ServicioTerapeuta>(`${this.apiUrl}/confirmar/${linkConfirmacion}`);
  }

  confirmarInicio(data: ConfirmacionServicioRequest): Observable<ServicioTerapeuta> {
    return this.http.post<ServicioTerapeuta>(`${this.apiUrl}/confirmar`, data);
  }

  getServicioTerapeutaByLinkFinalizacion(linkFinalizacion: string): Observable<ServicioTerapeuta> {
    return this.http.get<ServicioTerapeuta>(`${this.apiUrl}/finalizar/${linkFinalizacion}`);
  }

  finalizarServicio(data: FinalizacionServicioRequest): Observable<ServicioTerapeuta> {
    return this.http.post<ServicioTerapeuta>(`${this.apiUrl}/finalizar`, data);
  }

  getByPresentador(presentadorId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/presentador/${presentadorId}`);
  }

  getByTerapeuta(terapeutaId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/terapeuta/${terapeutaId}`);
  }

  getByFecha(fecha: Date): Observable<Servicio[]> {
    const fechaStr = fecha.toISOString().split('T')[0];
    return this.http.get<Servicio[]>(`${this.apiUrl}/fecha/${fechaStr}`);
  }

  getActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos`);
  }
}