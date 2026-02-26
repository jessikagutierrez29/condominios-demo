import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVehicleType } from "../service/vehicleType.service";

export default function VehicleTypeCreatePage() {
  const navigate = useNavigate();
  const condominiumId = 1;

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    try {
      await createVehicleType({
        condominium_id: condominiumId,
        name: name.trim(),
        is_active: isActive,
      });

      navigate("/ajustes/tipos-vehiculo?created=1");
    } catch (e) {
      console.error(e);
      setError("No se pudo crear el tipo.");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="app-button-secondary px-4 py-2 text-sm"
        >
          ← Volver
        </button>

        <div className="space-y-2">
          <div className="text-sm text-slate-500">
            Ajustes <span className="mx-2">/</span>
            <span className="text-slate-700 font-medium">
              Crear Tipo de Vehículo
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Nuevo Tipo de Vehículo
          </h1>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="app-card p-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Nombre del tipo
            </p>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 app-input h-14"
              placeholder="Ej: Automóvil"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Activo</p>
              <p className="text-sm text-slate-500">
                Disponible para selección
              </p>
            </div>

            <Switch checked={isActive} onChange={setIsActive} />
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <button
            onClick={handleSave}
            className="app-button-primary w-full sm:w-[520px] py-4 text-lg font-semibold"
          >
            🚗 Crear tipo
          </button>
        </div>
      </div>
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full transition relative ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`h-7 w-7 bg-white rounded-full absolute top-0.5 transition ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}
