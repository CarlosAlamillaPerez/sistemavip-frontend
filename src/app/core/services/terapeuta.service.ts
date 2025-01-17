import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Terapeuta, 
  CreateTerapeutaRequest, 
  UpdateTerapeutaRequest,
  UpdateTarifasRequest,
  CambioEstadoTerapeutaRequest,
  EstadoTerapeuta
} from '@core/interfaces/terapeuta.interface';

@Injectable({
  providedIn: 'root'
})
export class TerapeutaService {
  private readonly apiUrl = `${environment.apiUrl}/terapeuta`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Terapeuta[]> {
    return this.http.get<Terapeuta[]>(this.apiUrl);
  }

  getActivos(): Observable<Terapeuta[]> {
    return this.http.get<Terapeuta[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<Terapeuta> {
    return this.http.get<Terapeuta>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateTerapeutaRequest): Observable<Terapeuta> {
    return this.http.post<Terapeuta>(this.apiUrl, data);
  }

  update(id: number, data: UpdateTerapeutaRequest): Observable<Terapeuta> {
    return this.http.put<Terapeuta>(`${this.apiUrl}/${id}`, data);
  }

  cambiarEstado(id: number, cambioEstado: CambioEstadoTerapeutaRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/estado`,
      cambioEstado,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateTarifas(id: number, tarifas: UpdateTarifasRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/tarifas`, 
      tarifas, 
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}