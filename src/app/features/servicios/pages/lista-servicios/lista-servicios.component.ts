import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from '@core/services/servicio.service';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { Servicio } from '@core/interfaces/servicio.interface';
import { UserRole } from '@core/interfaces/user.interface';

@Component({
  selector: 'app-lista-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-servicios.component.html'
})
export class ListaServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = false;
  isAdmin = false;
  isPresentador = false;

  constructor(
    private servicioService: ServicioService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadServicios();
  }

  private checkUserRole(): void {
    this.authService.isAdmin().subscribe(isAdmin => this.isAdmin = isAdmin);
    this.authService.isPresentador().subscribe(isPresentador => this.isPresentador = isPresentador);
  }

  private loadServicios(): void {
    this.loading = true;
    this.servicioService.getActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.alertService.error('Error', 'No se pudieron cargar los servicios');
        this.loading = false;
      }
    });
  }

  onCrearServicio(): void {
    this.router.navigate(['/servicios/nuevo']);
  }

  onVerSeguimiento(servicioId: number): void {
    this.router.navigate([`/servicios/seguimiento/${servicioId}`]);
  }

  onEditarServicio(servicioId: number): void {
    this.router.navigate([`/servicios/editar/${servicioId}`]);
  }

  onCancelarServicio(servicio: Servicio): void {
    this.alertService.confirm(
      '¿Cancelar servicio?',
      '¿Está seguro que desea cancelar este servicio?',
      () => {
        this.servicioService.cancelar(servicio.id, {
          motivoCancelacion: 'Cancelado por usuario',
        }).subscribe({
          next: () => {
            this.alertService.success('Éxito', 'Servicio cancelado correctamente');
            this.loadServicios();
          },
          error: (error) => {
            console.error('Error al cancelar servicio:', error);
            this.alertService.error('Error', 'No se pudo cancelar el servicio');
          }
        });
      }
    );
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