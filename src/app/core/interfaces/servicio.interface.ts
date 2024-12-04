export interface Servicio {
    id: number;
    presentadorId: number;
    fechaSolicitud: Date;
    fechaServicio: Date;
    tipoServicio: string;
    direccion?: string;
    montoTotal: number;
    estado: string;
    fechaCancelacion?: Date;
    motivoCancelacion?: string;
    notasCancelacion?: string;
    notas?: string;
    nombrePresentador: string;
    terapeutas: ServicioTerapeuta[];
}

export interface ServicioTerapeuta {
    servicioId: number;
    terapeutaId: number;
    nombreTerapeuta: string;
    fechaAsignacion: Date;
    horaInicio?: Date;
    horaFin?: Date;
    estado: string;
    montoTerapeuta?: number;
    linkConfirmacion: string;
    linkFinalizacion: string;
    comprobantePagoTerapeuta: boolean;
}

export interface CreateServicioRequest {
    presentadorId: number;
    fechaServicio: Date;
    tipoServicio: string;
    direccion?: string;
    montoTotal: number;
    terapeutas: CreateServicioTerapeutaRequest[];
    notas?: string;
}

export interface CreateServicioTerapeutaRequest {
    terapeutaId: number;
    montoTerapeuta: number;
}

export interface UpdateServicioRequest {
    fechaServicio?: Date;
    direccion?: string;
    montoTotal?: number;
    notas?: string;
}

export interface ConfirmacionServicioRequest {
    linkConfirmacion: string;
    latitud: number;
    longitud: number;
}

export interface FinalizacionServicioRequest {
    linkFinalizacion: string;
    latitud: number;
    longitud: number;
}

export interface CancelacionServicioRequest {
    motivoCancelacion: string;
    notasCancelacion?: string;
}