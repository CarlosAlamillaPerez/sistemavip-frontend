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
  }

  ngOnInit(): void {
    this.loadTerapeutas();
    this.loadPresentadores();
  }

  private loadTerapeutas(): void {
    this.loading = true;
    this.terapeutaService.getActivos().subscribe({
      next: (data) => {
        this.terapeutas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar terapeutas:', error);
        this.alertService.error('Error', 'No se pudieron cargar los terapeutas');
        this.loading = false;
      }
    });
  }

  private loadPresentadores(): void {
    this.presentadorService.getActivos().subscribe({
      next: (data) => {
        this.presentadores = data;
      },
      error: (error) => {
        console.error('Error al cargar presentadores:', error);
        this.alertService.error('Error', 'No se pudieron cargar los presentadores');
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading) {
      this.loading = true;

      this.terapeutaPresentadorService.asignar(this.form.value).subscribe({
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
        'Por favor, seleccione un terapeuta y un presentador'
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/personal/asignaciones']);
  }
}