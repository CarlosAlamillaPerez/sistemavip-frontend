import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServicioService } from '@core/services/servicio.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { AlertService } from '@core/services/alert.service';
import { ServicioTerapeuta } from '@core/interfaces/servicio.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-confirmacion-servicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-servicio.component.html'
})
export class ConfirmacionServicioComponent implements OnInit {
  servicio: ServicioTerapeuta | null = null;
  loading = false;
  error: string | null = null;
  confirmando = false;
  linkConfirmacion!: string;

  constructor(
    private route: ActivatedRoute,
    private servicioService: ServicioService,
    private geolocationService: GeolocationService,
    private alertService: AlertService
  ) {
    const link = this.route.snapshot.paramMap.get('linkConfirmacion');
    if (!link) {
      this.error = 'Link de confirmación inválido';
      return;
    }
    this.linkConfirmacion = link;
  }

  ngOnInit(): void {
    this.cargarServicio();
  }

  private async cargarServicio(): Promise<void> {
    if (!this.linkConfirmacion) return;
    
    this.loading = true;
    try {
      this.servicio = await firstValueFrom(
        this.servicioService.getServicioTerapeutaByLinkConfirmacion(this.linkConfirmacion)
      );
    } catch (error) {
      this.error = 'No se pudo cargar la información del servicio';
      console.error('Error al cargar servicio:', error);
    } finally {
      this.loading = false;
    }
  }

  async confirmarServicio(): Promise<void> {
    if (this.confirmando) return;
    
    this.confirmando = true;
    try {
      const position = await firstValueFrom(this.geolocationService.getCurrentPosition());
      
      await firstValueFrom(
        this.servicioService.confirmarInicio({
          linkConfirmacion: this.linkConfirmacion,
          latitud: position.coords.latitude,
          longitud: position.coords.longitude
        })
      );

      this.alertService.success(
        'Servicio Confirmado',
        'Has confirmado exitosamente el inicio del servicio'
      );
    } catch (error: any) {
      this.alertService.error(
        'Error',
        error.message || 'No se pudo confirmar el servicio'
      );
    } finally {
      this.confirmando = false;
    }
  }
}