import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TerapeutaService } from '@core/services/terapeuta.service';
import { Terapeuta } from '@core/interfaces/terapeuta.interface';
import { AlertService } from '@core/services/alert.service';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@core/interfaces/user.interface';

@Component({
  selector: 'app-lista-terapeutas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-terapeutas.component.html',
  styleUrls: ['./lista-terapeutas.component.scss']
})
export class ListaTerapeutasComponent implements OnInit {
  terapeutas: Terapeuta[] = [];
  loading = false;
  isSuperAdmin = false;

  constructor(
    private terapeutaService: TerapeutaService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTerapeutas();
    this.checkRole();
  }

  private checkRole(): void {
    this.authService
      .hasRole(UserRole.SUPER_ADMIN)
      .subscribe((isSuperAdmin) => (this.isSuperAdmin = isSuperAdmin));
  }

  private loadTerapeutas(): void {
    this.loading = true;
    this.terapeutaService.getAll().subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeutas:', error);
        this.alertService.error('Error', 'Error al cargar la lista de terapeutas');
        this.loading = false;
      },
    });
  }

  onNuevo(): void {
    this.router.navigate(['/admin/personal/terapeutas/nuevo']);
  }

  onEditar(id: number): void {
    this.router.navigate([`/admin/personal/terapeutas/editar/${id}`]);
  }

  onCambiarEstado(id: number, nuevoEstado: string): void {
    this.alertService.confirm(
      '¿Está seguro?',
      `¿Desea cambiar el estado del terapeuta a ${nuevoEstado}?`,
      () => {
        this.terapeutaService.updateEstado(id, nuevoEstado).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', 'Estado actualizado correctamente', () =>
              this.loadTerapeutas()
            );
          },
          error: (error) => {
            console.error('Error al actualizar estado:', error);
            this.alertService.error('Error', 'No se pudo actualizar el estado del terapeuta');
          },
        });
      }
    );
  }

  onEliminar(id: number): void {
    this.alertService.confirm(
      '¿Está seguro?',
      'Esta acción eliminará permanentemente el terapeuta',
      () => {
        this.terapeutaService.delete(id).subscribe({
          next: () => {
            this.alertService.success('¡Éxito!', 'Terapeuta eliminado correctamente', () =>
              this.loadTerapeutas()
            );
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            this.alertService.error('Error', 'No se pudo eliminar el terapeuta');
          },
        });
      }
    );
  }
}