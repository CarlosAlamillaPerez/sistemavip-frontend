// src/app/features/admin/personal/presentadores/pages/form-presentador/form-presentador.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PresentadorService } from '@core/services/presentador.service';
import { AlertService } from '@core/services/alert.service';
import { CreatePresentadorRequest, UpdatePresentadorRequest, Presentador } from '@core/interfaces/presentador.interface';

@Component({
  selector: 'app-form-presentador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-presentador.component.html',
  styleUrls: ['./form-presentador.component.scss']
})
export class FormPresentadorComponent implements OnInit {
  presentadorForm: FormGroup;
  isEditing = false;
  presentadorId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private presentadorService: PresentadorService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.presentadorForm = this.createForm();
  }

  ngOnInit(): void {
    this.presentadorId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditing = !!this.presentadorId;

    if (this.isEditing) {
      this.loadPresentador();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      documentoIdentidad: ['', [Validators.required, Validators.minLength(5)]],
      porcentajeComision: [30, [Validators.required, Validators.min(0), Validators.max(100)]],
      password: ['', this.isEditing ? [] : [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      fotoUrl: [''],
      notas: ['']
    });
  }

  private loadPresentador(): void {
    if (!this.presentadorId) return;
  
    this.loading = true;
    this.presentadorService.getById(this.presentadorId).subscribe({
      next: (presentador) => {
        this.presentadorForm.patchValue(presentador);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar presentador:', error);
        this.alertService.error(
          'Error',
          'No se pudo cargar la información del presentador',
          () => this.router.navigate(['/admin/personal/presentadores'])
        );
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.presentadorForm.invalid || this.loading) return;

    this.loading = true;
    const formData = this.presentadorForm.value;

    if (this.isEditing) {
      // En edición solo enviamos los campos permitidos
      const updateData: UpdatePresentadorRequest = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        email: formData.email,
        fotoUrl: formData.fotoUrl,
        notas: formData.notas
      };

      this.presentadorService.update(this.presentadorId!, updateData).subscribe({
        next: () => this.handleSuccess('Presentador actualizado correctamente'),
        error: (error) => this.handleError(error)
      });
    } else {
      // En creación enviamos todos los campos
      const createData: CreatePresentadorRequest = {
        ...formData,
        porcentajeComision: Number(formData.porcentajeComision)
      };

      this.presentadorService.create(createData).subscribe({
        next: () => this.handleSuccess('Presentador creado correctamente'),
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleSuccess(message: string): void {
    this.loading = false;
    this.alertService.success('¡Éxito!', message, () => {
      this.router.navigate(['/admin/personal/presentadores']);
    });
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);
    this.alertService.error(
      'Error',
      error.error?.message || 'Ha ocurrido un error. Por favor, intente nuevamente.'
    );
  }

  onCancel(): void {
    this.router.navigate(['/admin/personal/presentadores']);
  }
}