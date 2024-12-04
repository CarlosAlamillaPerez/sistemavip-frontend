export interface Presentador {
    id: number;
    userId: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    porcentajeComision: number;
    fechaAlta: Date;
    estado: string;
    documentoIdentidad: string;
    fotoUrl?: string;
    ultimaActualizacion: Date;
    notas?: string;
  }
  
  export interface CreatePresentadorRequest {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    porcentajeComision: number;
    documentoIdentidad: string;
    fotoUrl?: string;
    notas?: string;
  }
  
  export interface UpdatePresentadorRequest {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    fotoUrl?: string;
    notas?: string;
  }