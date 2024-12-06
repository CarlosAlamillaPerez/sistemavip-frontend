export enum EstadoAsignacion {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
    SUSPENDIDO = 'SUSPENDIDO'
  }
  
  export interface TerapeutaPresentador {
      terapeutaId: number;
      presentadorId: number;
      fechaAsignacion: Date;
      estado: EstadoAsignacion;
      fechaCambioEstado?: Date;
      motivoEstado?: string;
      nombreTerapeuta: string;
      apellidoTerapeuta: string;
      nombrePresentador: string;
      apellidoPresentador: string;
  }
  
  export interface TerapeutaPorPresentador {
      terapeutaId: number;
      nombreCompleto: string;
      telefono: string;
      email: string;
      estado: EstadoAsignacion;
      fechaAsignacion: Date;
      fechaCambioEstado?: Date;
      motivoEstado?: string;
  }
  
  export interface AsignarTerapeutaPresentadorRequest {
      terapeutaId: number;
      presentadorId: number;
  }
  
  export interface CambioEstadoAsignacionRequest {
      estado: EstadoAsignacion;
      motivoEstado?: string;
  }