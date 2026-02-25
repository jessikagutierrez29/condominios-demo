import { useState } from "react";
import Card from "../../components/Card";
import Pill from "../../components/Pill";

const iconByType = (name) => {
  const n = name.toLowerCase();

  if (n.includes("apart")) return "🏢";
  if (n.includes("cas")) return "🏠";
  if (n.includes("pen")) return "🏙️";
  if (n.includes("oficina")) return "🏬";
  if (n.includes("local")) return "🏪";

  return "🏘";
};

export default function UnitTypeList({
  unitTypes,
  onUpdate,
}) {
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  const startEdit = (u) => {
    setEditingId(u.id);
    setTempName(u.name);
  };

  const saveEdit = async (id) => {
    await onUpdate(id, { name: tempName });
    setEditingId(null);
  };

  const toggleStatus = async (u) => {
    await onUpdate(u.id, {
      is_active: !u.is_active,
    });
  };

  return (
    <div className="px-5 mt-4 space-y-4">
      {unitTypes.map((u) => (
        <Card
          key={u.id}
          className="p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">

            {/* ICONO */}
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
              {iconByType(u.name)}
            </div>

            {/* INFO */}
            <div>
              <div className="flex items-center gap-3">

                {editingId === u.id ? (
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-xl font-extrabold text-slate-900">
                    {u.name}
                  </p>
                )}

                <Pill variant={u.is_active ? "success" : "warning"}>
                  {u.is_active ? "ACTIVO" : "INACTIVO"}
                </Pill>
              </div>

              <p className="text-slate-500 mt-1">
                Unidades creadas:{" "}
                <span className="font-extrabold text-slate-900">
                  {u.apartments_count ?? 0}
                </span>
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">

            {/* EDITAR */}
            {editingId === u.id ? (
              <button
                onClick={() => saveEdit(u.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={() => startEdit(u)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Editar
              </button>
            )}

            {/* ACTIVAR / DESACTIVAR */}
            <button
              onClick={() => toggleStatus(u)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                u.is_active
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              {u.is_active ? "Desactivar" : "Activar"}
            </button>

          </div>


        </Card>
      ))}
    </div>
  );
}
