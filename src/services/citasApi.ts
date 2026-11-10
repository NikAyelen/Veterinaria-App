import type { ActualizarCita, Cita, EstadoCita, NuevaCita } from "../types";

const API_URL = "http://localhost:3000/api/citas";

export async function obtenerCitas(): Promise<Cita[]> {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) throw new Error("No fue posible consultar las citas.");
  return respuesta.json();
}

export async function actualizarEstado(
  id: number, estado: EstadoCita,
): Promise<Cita> {
  const respuesta = await fetch(`${API_URL}/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });

  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje);
  return resultado.cita;
}

// manda la nueva cita al POST y regresa la cita guardada en la BD
export async function crearCita(datos: NuevaCita): Promise<Cita> {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje); // mensaje del backend
  return resultado.cita;
}

// manda todos los datos al PUT para modificar una cita existente
export async function actualizarCita(
  id: number, datos: ActualizarCita,
): Promise<Cita> {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje);
  return resultado.cita;
}