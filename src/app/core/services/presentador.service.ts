import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { 
  Presentador, 
  CreatePresentadorRequest, 
  UpdatePresentadorRequest,
  CambioEstadoPresentadorRequest,
  EstadoPresentador
} from '@core/interfaces/presentador.interface';

@Injectable({
  providedIn: 'root'
})
export class PresentadorService {
  private readonly apiUrl = `${environment.apiUrl}/presentador`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Presentador[]> {
    return this.http.get<Presentador[]>(this.apiUrl);
  }

  getActivos(): Observable<Presentador[]> {
    return this.http.get<Presentador[]>(`${this.apiUrl}/activos`);
  }

  getById(id: number): Observable<Presentador> {
    return this.http.get<Presentador>(`${this.apiUrl}/${id}`);
  }

  create(data: CreatePresentadorRequest): Observable<Presentador> {
    return this.http.post<Presentador>(this.apiUrl, data);
  }

  update(id: number, data: UpdatePresentadorRequest): Observable<Presentador> {
    return this.http.put<Presentador>(`${this.apiUrl}/${id}`, data);
  }

  cambiarEstado(id: number, cambioEstado: CambioEstadoPresentadorRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/estado`,
      cambioEstado,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  updateComision(id: number, nuevoPorcentaje: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/comision`, 
      JSON.stringify(nuevoPorcentaje), 
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}