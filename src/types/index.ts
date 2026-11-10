export type EstadoCita = 'solicitada' | 'confirmada' | 'atendida';

export type Cita = {
  id: number;
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
};

// datos que se mandan al POST 
export type NuevaCita = {
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
};

// datos que se mandan al PUT 
export type ActualizarCita = {
  mascota: string;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
};