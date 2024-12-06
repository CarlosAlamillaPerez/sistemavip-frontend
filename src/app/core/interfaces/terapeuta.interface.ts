export enum EstadoTerapeuta {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO'
}

export interface Terapeuta {
    id: number;
    userId: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: Date;
    fechaAlta: Date;
    estado: EstadoTerapeuta;
    fechaCambioEstado: Date;
    motivoEstado?: string;
    estatura: string;
    documentoIdentidad: string;
    fotoUrl?: string;
    ultimaActualizacion: Date;
    notas?: string;
    tarifaBase: number;
    tarifaExtra: number;
}

export interface CreateTerapeutaRequest {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: Date;
    estatura: string;
    documentoIdentidad: string;
    fotoUrl?: string;
    notas?: string;
    tarifaBase: number;
    tarifaExtra: number;
}

export interface UpdateTerapeutaRequest {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    estatura?: string;
    fotoUrl?: string;
    notas?: string;
}

export interface UpdateTarifasRequest {
    tarifaBase: number;
    tarifaExtra: number;
}

export interface CambioEstadoTerapeutaRequest {
    estado: EstadoTerapeuta;
    motivoEstado?: string;
}