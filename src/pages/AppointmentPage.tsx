import { useEffect, useState } from "react";
import { AppointmentCard } from "../components/AppointmentCard";
import { StatCard } from "../components/StatCard";
import { NuevaCitaForm } from "../components/NuevaCitaForm";
//import { citasIniciales } from "../data/citas";
import {
  actualizarCita, actualizarEstado, crearCita, obtenerCitas,
} from "../services/citasApi";

import type { Cita, EstadoCita, NuevaCita } from "../types";

type Filtro = "todas" | EstadoCita;

export function AppointmentsPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [citaEditando, setCitaEditando] = useState<Cita | null>(null);

  useEffect(() => {
    async function cargarCitas() {
      try {
        setCargando(true);
        setCitas(await obtenerCitas());
      } catch (error) {
        setError(error instanceof Error ? error.message : "Ocurrió un error.");
      } finally {
        setCargando(false);
      }
    }

    void cargarCitas();
  }, []);

  async function confirmarCita(id: number) {
    try {
      const actualizada = await actualizarEstado(id, "confirmada");
      setCitas((actuales) =>
        actuales.map((cita) => (cita.id === id ? actualizada : cita)),
      );
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al confirmar.");
    }
  }

  // guarda la cita con el POST y la agrega a la lista
  // si falla, el error lo muestra el formulario
  async function registrarCita(datos: NuevaCita) {
    const nueva = await crearCita(datos);
    setCitas((actuales) => [...actuales, nueva]);
    setMensaje("Cita registrada correctamente.");
    setError("");
    setMostrarForm(false);
  }

  // abre el formulario con los datos de la cita que se quiere editar
  function editarCita(cita: Cita) {
    setCitaEditando(cita);
    setMostrarForm(true);
    setMensaje("");
  }

  // guarda los cambios con el PUT y reemplaza la cita en la lista
  async function guardarEdicion(datos: NuevaCita) {
    if (!citaEditando) return;
    const actualizada = await actualizarCita(citaEditando.id, {
      ...datos,
      estado: citaEditando.estado,
    });
    setCitas((actuales) =>
      actuales.map((cita) => (cita.id === actualizada.id ? actualizada : cita)),
    );
    setMensaje("Cita actualizada correctamente.");
    setError("");
    setMostrarForm(false);
    setCitaEditando(null);
  }

  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [mensaje, setMensaje] = useState("");

  const citasFiltradas =
    filtro === "todas" ? citas : citas.filter((cita) => cita.estado === filtro);

  const pendientes = citas.filter((c) => c.estado === "solicitada").length;
  const confirmadas = citas.filter((c) => c.estado === "confirmada").length;

 
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-950">Agenda de citas</h2>
          <p className="mt-1 text-slate-600">
            Consulta y administra las citas del día.
          </p>
        </div>
        <button
          onClick={() => {
            setCitaEditando(null);
            setMostrarForm(true);
            setMensaje("");
          }}
          className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800"
        >
          + Nueva cita
        </button>
      </section>

      {mostrarForm && (
        <NuevaCitaForm
          key={citaEditando ? citaEditando.id : "nueva"}
          cita={citaEditando ?? undefined}
          onGuardar={citaEditando ? guardarEdicion : registrarCita}
          onCancelar={() => {
            setMostrarForm(false);
            setCitaEditando(null);
          }}
        />
      )}

      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          titulo="Citas de hoy"
          valor={citas.length}
          color="text-teal-700"
        />
        <StatCard
          titulo="Pendientes"
          valor={pendientes}
          color="text-amber-600"
        />
        <StatCard
          titulo="Confirmadas"
          valor={confirmadas}
          color="text-green-600"
        />
      </section>

      <section className="mt-8">
        <label
          htmlFor="filtro"
          className="mb-2 block font-semibold text-slate-700"
        >
          Filtrar por estado
        </label>
        <select
          id="filtro"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as Filtro)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 sm:w-64"
        >
          <option value="todas">Todas</option>
          <option value="solicitada">Solicitadas</option>
          <option value="confirmada">Confirmadas</option>
          <option value="atendida">Atendidas</option>
        </select>
      </section>

      {mensaje && (
        <p
          aria-live="polite"
          className="mt-6 rounded-xl bg-green-100 px-4 py-3 text-green-800"
        >
          {mensaje}
        </p>
      )}

      {error && (
        <p
          aria-live="polite"
          className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-red-800"
        >
          {error}
        </p>
      )}

      <section className="mt-6 grid gap-4">
        {cargando ? (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            Cargando citas...
          </p>
        ) : citasFiltradas.length > 0 ? (
          citasFiltradas.map((cita) => (
            <AppointmentCard
              key={cita.id}
              cita={cita}
              onConfirmar={confirmarCita}
              onEditar={editarCita}
            />
          ))
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
            No se encontraron citas con ese estado.
          </p>
        )}
      </section>
    </main>
  );
}