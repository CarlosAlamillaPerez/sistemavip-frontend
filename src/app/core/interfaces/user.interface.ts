export interface User {
  id: string;
  email: string;
  role: UserRole;
  nombre?: string;
  apellido?: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PRESENTADOR = 'PRESENTADOR',
  TERAPEUTA = 'TERAPEUTA'
}
  
export interface UserProfile {
  userId: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  documentoIdentidad: string;
  fotoUrl?: string;
  estado: string;
  fechaAlta: Date;
  ultimaActualizacion: Date;
}

export interface TerapeutaProfile extends UserProfile {
  fechaNacimiento: Date;
  estatura: string;
  tarifaBase: number;
  tarifaExtra: number;
}

export interface PresentadorProfile extends UserProfile {
  porcentajeComision: number;
}