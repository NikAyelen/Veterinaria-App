import type { Cita } from '../types';
import { StatusBadge } from './StatusBadge';

type Props = {
  cita: Cita;
  onConfirmar: (id: number) => void;
  onEditar: (cita: Cita) => void;
  onEliminar: (id: number) => void;
};

export function AppointmentCard({ cita, onConfirmar, onEditar, onEliminar }: Props) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">{cita.mascota}</h3>
            <StatusBadge estado={cita.estado} />
          </div>
          <p className="mt-2 text-sm text-slate-600">Cliente: {cita.cliente}</p>
          <p className="text-sm text-slate-600">{cita.servicio} · {cita.fecha} · {cita.hora.slice(0, 5)}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => onEditar(cita)}
            className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700
                       transition hover:-translate-y-0.5 hover:bg-slate-300
                       focus:outline-none focus:ring-4 focus:ring-slate-200">
            Editar
          </button>

          {/* botón para eliminar, avisa a la página con el id */}
          <button onClick={() => onEliminar(cita.id)}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white
                       transition hover:-translate-y-0.5 hover:bg-red-700
                       focus:outline-none focus:ring-4 focus:ring-red-200">
            Eliminar
          </button>

          {cita.estado === 'solicitada' && (
            <button onClick={() => onConfirmar(cita.id)}
              className="rounded-xl bg-teal-700 px-4 py-2 font-semibold text-white
                         transition hover:-translate-y-0.5 hover:bg-teal-800
                         focus:outline-none focus:ring-4 focus:ring-teal-200">
              Confirmar cita
            </button>
          )}
        </div>
      </div>
    </article>
  );
}