import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServicioService } from '@core/services/servicio.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { AlertService } from '@core/services/alert.service';
import { ServicioTerapeuta } from '@core/interfaces/servicio.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-finalizacion-servicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalizacion-servicio.component.html'
})
export class FinalizacionServicioComponent implements OnInit {
  servicio: ServicioTerapeuta | null = null;
  loading = false;
  error: string | null = null;
  finalizando = false;
  linkFinalizacion!: string;
  duracionServicio: string = '';

  constructor(
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private geolocationService: GeolocationService,
    private alertService: AlertService
  ) {
    const link = this.route.snapshot.paramMap.get('linkFinalizacion');
    if (!link) {
      this.error = 'Link de finalización inválido';
      return;
    }
    this.linkFinalizacion = link;
  }

  ngOnInit(): void {
    this.cargarServicio();
  }

  private async cargarServicio(): Promise<void> {
    if (!this.linkFinalizacion) return;
    
    this.loading = true;
    try {
      this.servicio = await firstValueFrom(
        this.servicioService.getServicioTerapeutaByLinkFinalizacion(this.linkFinalizacion)
      );
      this.calcularDuracion();
    } catch (error) {
      this.error = 'No se pudo cargar la información del servicio';
      console.error('Error al cargar servicio:', error);
    } finally {
      this.loading = false;
    }
  }

  private calcularDuracion(): void {
    if (!this.servicio?.horaInicio) return;

    const inicio = new Date(this.servicio.horaInicio);
    const ahora = new Date();
    const diferencia = ahora.getTime() - inicio.getTime();
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    this.duracionServicio = `${horas}h ${minutos}m`;
  }

  async finalizarServicio(): Promise<void> {
    if (this.finalizando) return;

    this.finalizando = true;
    try {
      // Solicitar confirmación antes de finalizar
      this.alertService.confirm(
        '¿Finalizar servicio?',
        'Esta acción no se puede deshacer. ¿Estás seguro de finalizar el servicio?',
        async () => {
          const position = await firstValueFrom(this.geolocationService.getCurrentPosition());
          
          await firstValueFrom(
            this.servicioService.finalizarServicio({
              linkFinalizacion: this.linkFinalizacion,
              latitud: position.coords.latitude,
              longitud: position.coords.longitude
            })
          );

          this.alertService.success(
            'Servicio Finalizado',
            'Has finalizado exitosamente el servicio'
          );
        }
      );
    } catch (error: any) {
      this.alertService.error(
        'Error',
        error.message || 'No se pudo finalizar el servicio'
      );
    } finally {
      this.finalizando = false;
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Pendiente':
        return 'bg-warning';
      case 'EnProceso':
        return 'bg-info';
      case 'Finalizado':
        return 'bg-success';
      case 'Cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}