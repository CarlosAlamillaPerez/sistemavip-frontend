export interface TerapeutaPresentador {
    terapeutaId: number;
    presentadorId: number;
    fechaAsignacion: Date;
    estado: string;
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
    estado: string;
    fechaAsignacion: Date;
}

export interface AsignarTerapeutaPresentadorRequest {
    terapeutaId: number;
    presentadorId: number;
}