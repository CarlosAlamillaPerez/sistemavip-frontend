export interface Terapeuta {
    id: number;
    userId: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    fechaNacimiento: Date;
    fechaAlta: Date;
    estado: string;
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