import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TerapeutaPresentadorService } from '@core/services/terapeuta-presentador.service';
import { TerapeutaService } from '@core/services/terapeuta.service';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { Terapeuta } from '@core/interfaces/terapeuta.interface';
import { Presentador } from '@core/interfaces/presentador.interface';
import { EstadoTerapeuta } from '@core/interfaces/terapeuta.interface';
import { EstadoPresentador } from '@core/interfaces/presentador.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-form-asignacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-asignacion.component.html',
  styleUrls: ['./form-asignacion.component.scss']
})
export class FormAsignacionComponent implements OnInit {
  form: FormGroup;
  loading = false;
  terapeutas: Terapeuta[] = [];
  presentadores: Presentador[] = [];
  terapeutaSeleccionada?: Terapeuta;
  presentadorSeleccionado?: Presentador;

  constructor(
    private fb: FormBuilder,
    private terapeutaPresentadorService: TerapeutaPresentadorService,
    private terapeutaService: TerapeutaService,
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.form = this.fb.group({
      terapeutaId: ['', [Validators.required]],
      presentadorId: ['', [Validators.required]]
    });

    // Suscribirse a cambios en los selectores
    this.form.get('terapeutaId')?.valueChanges.subscribe(id => {
      this.terapeutaSeleccionada = this.terapeutas.find(t => t.id === id);
    });

    this.form.get('presentadorId')?.valueChanges.subscribe(id => {
      this.presentadorSeleccionado = this.presentadores.find(p => p.id === id);
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      terapeutas: this.terapeutaService.getActivos(),
      presentadores: this.presentadorService.getActivos()
    }).subscribe({
      next: (data) => {
        this.terapeutas = data.terapeutas;
        this.presentadores = data.presentadores;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.alertService.error('Error', 'No se pudieron cargar los datos necesarios');
        this.loading = false;
      }
    });
  }

  private validarAsignacion(): boolean {
    if (!this.terapeutaSeleccionada || !this.presentadorSeleccionado) {
      return false;
    }

    // Validar estado de terapeuta
    if (this.terapeutaSeleccionada.estado !== EstadoTerapeuta.ACTIVO) {
      this.alertService.warning(
        'Terapeuta No Disponible',
        'La terapeuta seleccionada no está activa en el sistema'
      );
      return false;
    }

    // Validar estado de presentador
    if (this.presentadorSeleccionado.estado !== EstadoPresentador.ACTIVO) {
      this.alertService.warning(
        'Presentador No Disponible',
        'El presentador seleccionado no está activo en el sistema'
      );
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading) {
      if (!this.validarAsignacion()) {
        return;
      }

      this.loading = true;
      const data = this.form.value;

      this.terapeutaPresentadorService.asignar(data).subscribe({
        next: () => {
          this.alertService.success(
            '¡Éxito!',
            'Asignación creada correctamente',
            () => this.router.navigate(['/admin/personal/asignaciones'])
          );
        },
        error: (error) => {
          console.error('Error al crear asignación:', error);
          this.alertService.error(
            'Error',
            error.error?.message || 'No se pudo crear la asignación'
          );
          this.loading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
      this.alertService.warning(
        'Formulario Inválido',
        'Por favor, seleccione una terapeuta y un presentador'
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/personal/asignaciones']);
  }
}