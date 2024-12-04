import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '@core/services/servicio.service';
import { AlertService } from '@core/services/alert.service';
import { Servicio } from '@core/interfaces/servicio.interface';

@Component({
  selector: 'app-seguimiento-servicio',
  standalone: true,
  imports: [CommonModule, ClipboardModule],
  templateUrl: './seguimiento-servicio.component.html'
})
export class SeguimientoServicioComponent implements OnInit {
  servicio: Servicio | null = null;
  loading = false;
  servicioId!: number;

  constructor(
    private servicioService: ServicioService,
    public  alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/servicios']);
      return;
    }
    this.servicioId = +id;
  }

  ngOnInit(): void {
    this.loadServicio();
  }

  getHoraFormateada(fecha: Date | null | undefined): string {
    return fecha ? new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'No registrada';
  }

  private loadServicio(): void {
    this.loading = true;
    this.servicioService.getById(this.servicioId).subscribe({
      next: (data) => {
        this.servicio = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicio:', error);
        this.alertService.error('Error', 'No se pudo cargar el servicio', 
          () => this.router.navigate(['/servicios']));
        this.loading = false;
      }
    });
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

  onBack(): void {
    this.router.navigate(['/servicios']);
  }
}