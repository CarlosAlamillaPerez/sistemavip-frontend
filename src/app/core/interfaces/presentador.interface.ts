// presentador.interface.ts

export enum EstadoPresentador {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
    SUSPENDIDO = 'SUSPENDIDO'
  }
  
  // Interfaz principal de Presentador
  export interface Presentador {
    id: number;
    userId: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    porcentajeComision: number;
    fechaAlta: Date;
    estado: EstadoPresentador;
    fechaCambioEstado: Date;
    motivoEstado?: string;
    documentoIdentidad: string;
    fotoUrl?: string;
    ultimaActualizacion: Date;
    notas?: string;
  }
  
  // DTO para crear presentador
  export interface CreatePresentadorRequest {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;  // Requerido para crear usuario en Identity
    porcentajeComision: number;
    documentoIdentidad: string;
    fotoUrl?: string;
    notas?: string;
  }
  
  // DTO para actualizar presentador
  export interface UpdatePresentadorRequest {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    fotoUrl?: string;
    notas?: string;
  }
  
  // DTO para cambio de estado
  export interface CambioEstadoPresentadorRequest {
    estado: EstadoPresentador;
    motivoEstado: string; // Requerido siempre
  }
  
  // DTO para actualizar comisión
  export interface UpdateComisionRequest {
    nuevoPorcentaje: number;
  }
  
  // Respuesta de resumen del presentador
  export interface ResumenPresentadorDto {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    estado: EstadoPresentador;
    serviciosActivos: number;
    terapeutasActivas: number;
    comisionesPendientes: number;
    ultimaActualizacion: Date;
  }
  
  // Para manejar errores específicos del backend
  export interface PresentadorError {
    code: 'VALIDACION_ESTADO' | 'ERROR_INTERNO';
    message: string;
  }