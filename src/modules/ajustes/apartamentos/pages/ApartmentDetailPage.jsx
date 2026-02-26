import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApartment } from "../service/apartments.service";

export default function ApartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getApartment(id);
        setApartment(res.data);
      } catch {
        setApartment(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-slate-500">Cargando apartamento...</div>;
  }

  if (!apartment) {
    return (
      <div className="p-6 space-y-4">
        <Header
          title="Detalle de Apartamento"
          subtitle={`ID: ${id}`}
          onBack={() => navigate("/ajustes/apartamentos")}
        />

        <div className="app-card p-5">
          <p className="text-sm text-slate-700">
            No se encontró el apartamento con ID <b>{id}</b>.
          </p>

          <button
            type="button"
            onClick={() => navigate("/ajustes/apartamentos")}
            className="mt-4 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const title = `Apto ${apartment.number}`;
  const estado = getApartmentStatus(apartment);
  const estadoLabel = estadoToLabel(estado);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-500">
            Ajustes <span className="mx-2">/</span>
            <button
              type="button"
              onClick={() => navigate("/ajustes/apartamentos")}
              className="hover:text-slate-700"
            >
              Apartamentos
            </button>
            <span className="mx-2">/</span>
            <span className="text-slate-700 font-medium">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
              🏢
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">
                {apartment.tower ?? "-"} • Piso {apartment.floor ?? "-"} • ID{" "}
                {apartment.id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/ajustes/apartamentos")}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="app-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
          <StatusPill estado={estado} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Info label="Torre" value={apartment.tower} />
          <Info label="Piso" value={apartment.floor} />
          <Info label="Número" value={apartment.number} />
          <Info label="Estado" value={estadoLabel} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 app-card p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Información operativa
          </h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Info label="Tipo" value={apartment.unit_type?.name ?? "-"} />
            <Info label="Condición" value="Automática (sin edición manual)" />
            <Info label="Uso" value="Portería / Administración" />
            <Info label="Activo" value={apartment.is_active ? "Sí" : "No"} />
          </div>
        </div>

        <div className="app-card p-5">
          <h2 className="text-lg font-semibold text-slate-900">Trazabilidad</h2>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <Dot />
              <div>
                <p className="font-medium text-slate-800">Creación</p>
                <p className="text-slate-500">
                  {new Date(apartment.created_at).toLocaleString()}
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Dot />
              <div>
                <p className="font-medium text-slate-800">Última actualización</p>
                <p className="text-slate-500">
                  {new Date(apartment.updated_at).toLocaleString()}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function getApartmentStatus(a) {
  if (!a.is_active) return "mantenimiento";
  if (a.residents && a.residents.length > 0) return "ocupado";
  return "disponible";
}

function Header({ title, subtitle, onBack }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
      >
        Volver
      </button>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900 mt-1">
        {value ?? "-"}
      </div>
    </div>
  );
}

function Dot() {
  return <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />;
}

function estadoToLabel(estado) {
  if (estado === "ocupado") return "Ocupado";
  if (estado === "disponible") return "Disponible";
  if (estado === "mantenimiento") return "Mantenimiento";
  return estado ?? "-";
}

function StatusPill({ estado }) {
  const label = estadoToLabel(estado);

  const cls =
    estado === "ocupado"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : estado === "disponible"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${cls}`}>
      {label}
    </span>
  );
}
