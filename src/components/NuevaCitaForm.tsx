import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { Cita, NuevaCita } from "../types";

type Props = {
  cita?: Cita; // si viene, el formulario es para editar
  onGuardar: (datos: NuevaCita) => Promise<void>;
  onCancelar: () => void;
};

const servicios = ["Vacunación", "Consulta general", "Desparasitación"];

export function NuevaCitaForm({ cita, onGuardar, onCancelar }: Props) {
  // si es edición, empieza con los datos de la cita
  const [mascota, setMascota] = useState(cita ? cita.mascota : "");
  const [cliente, setCliente] = useState(cita ? cita.cliente : "");
  const [servicio, setServicio] = useState(cita ? cita.servicio : "");
  const [fecha, setFecha] = useState(cita ? cita.fecha : "");
  const [hora, setHora] = useState(cita ? cita.hora.slice(0, 5) : "");
  const [error, setError] = useState("");

  async function enviar(e: SyntheticEvent) {
    e.preventDefault(); // evita recargar la página

    // validación en el front
    if (!mascota.trim() || !cliente.trim() || !servicio || !fecha || !hora) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setError("");
      await onGuardar({ mascota, cliente, servicio, fecha, hora }); // llama al POST o al PUT
    } catch (error) {
      // error que manda el backend 
      setError(error instanceof Error ? error.message : "Error al guardar.");
    }
  }

  return (
    <form
      onSubmit={enviar}
      className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <h3 className="text-lg font-bold text-slate-900">
        {cita ? "Editar cita" : "Registrar nueva cita"}
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mascota" className="mb-1 block font-semibold text-slate-700">
            Mascota
          </label>
          <input
            id="mascota"
            value={mascota}
            onChange={(e) => setMascota(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="cliente" className="mb-1 block font-semibold text-slate-700">
            Cliente
          </label>
          <input
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="servicio" className="mb-1 block font-semibold text-slate-700">
            Servicio
          </label>
          <select
            id="servicio"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            {/* por si la cita trae un servicio que no está en la lista */}
            {cita && !servicios.includes(cita.servicio) && (
              <option value={cita.servicio}>{cita.servicio}</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="fecha" className="mb-1 block font-semibold text-slate-700">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="hora" className="mb-1 block font-semibold text-slate-700">
            Hora
          </label>
          <input
            id="hora"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
        </div>
      </div>

      {error && (
        <p
          aria-live="polite"
          className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-red-800"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
        >
          {cita ? "Guardar cambios" : "Guardar cita"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}