import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { Presentador } from '@core/interfaces/presentador.interface';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';

@Component({
  selector: 'app-lista-presentadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-presentadores.component.html',
  styleUrls: ['./lista-presentadores.component.scss'],
})
export class ListaPresentadoresComponent implements OnInit {
  presentadores: Presentador[] = [];
  loading = false;
  isSuperAdmin = false;

  constructor(
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPresentadores();
    this.checkRole();
  }

  private checkRole(): void {
    this.authService
      .hasRole(UserRole.SUPER_ADMIN)
      .subscribe((isSuperAdmin) => (this.isSuperAdmin = isSuperAdmin));
  }

  private loadPresentadores(): void {
    this.loading = true;
    this.presentadorService.getAll().subscribe({
      next: (data) => {
        this.presentadores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar presentadores:', error);
        this.alertService.error('Error', 'Error al cargar la lista de presentadores');
        this.loading = false;
      },
    });
  }

  onNuevo(): void {
    this.router.navigate(['/admin/personal/presentadores/nuevo']);
  }

  onEditar(id: number): void {
    this.router.navigate([`/admin/personal/presentadores/editar/${id}`]);
  }

  onCambiarEstado(id: number, nuevoEstado: string): void {
    this.alertService.confirm(
      '¿Está seguro?',
      `¿Desea cambiar el estado del presentador a ${nuevoEstado}?`,
      () => {
        this.presentadorService.updateEstado(id, nuevoEstado).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', 'Estado actualizado correctamente', () =>
              this.loadPresentadores()
            );
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            this.alertService.error('Error', 'No se pudo actualizar el estado del presentador');
          },
        });
      }
    );
  }

  onEliminar(id: number): void {
    this.alertService.confirm(
      '¿Está seguro?',
      'Esta acción eliminará permanentemente el presentador',
      () => {
        this.presentadorService.delete(id).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', 'Presentador eliminado correctamente', () =>
              this.loadPresentadores()
            );
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            this.alertService.error('Error', 'No se pudo eliminar el presentador');
          },
        });
      }
    );
  }
}
