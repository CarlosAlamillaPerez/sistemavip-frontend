import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comisiones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css']
})
export class ComisionesComponent {
  resumenComisiones = {
    totalPendientes: 0,
    totalPagadas: 0,
    montoTotalPendiente: 0,
    montoTotalPagado: 0
  };
}