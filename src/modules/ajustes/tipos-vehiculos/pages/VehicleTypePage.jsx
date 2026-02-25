import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchVehicleTypes
} from "../service/vehicleType.service";

export default function VehicleTypeListPage() {
  const navigate = useNavigate();
  const condominiumId = 1; // luego lo tomamos del contexto SaaS

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchVehicleTypes(condominiumId);
      setTypes(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeactivate = async (id) => {
    await deactivateVehicleType(id);
    load();
  };

  return (
    <div className="p-6 space-y-5">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-500">
            Ajustes <span className="mx-2">/</span>
            <span className="text-slate-700 font-medium">
              Tipos de Vehículo
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Tipos de Vehículo
          </h1>
        </div>

        <button
          onClick={() => navigate("/ajustes/tipos-vehiculos/crear")}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          + Nuevo tipo
        </button>
      </div>

      {/* LISTA */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
        {loading && (
          <p className="text-slate-500 text-sm">
            Cargando tipos...
          </p>
        )}

        {!loading && types.length === 0 && (
          <p className="text-slate-500 text-sm">
            No hay tipos registrados.
          </p>
        )}

        {!loading &&
          types.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500">
                  ID: {t.id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill active={t.is_active} />

                <button
                  onClick={() => handleDeactivate(t.id)}
                  className="px-3 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Desactivar
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ---------- UI ---------- */

function StatusPill({ active }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs border ${
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-red-50 text-red-700 border-red-100"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}
