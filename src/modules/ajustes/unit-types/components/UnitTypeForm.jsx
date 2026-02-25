import { useState } from "react";

export default function UnitTypeForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    await onSubmit({
      name,
      is_active: isActive,
    });

    setName("");
    setIsActive(true);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
      <h2 className="font-semibold text-slate-800">
        Registrar tipo de unidad
      </h2>

      <input
        type="text"
        placeholder="Ej. Apartamento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-lg border border-slate-300"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Activo
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Crear tipo"}
      </button>
    </div>
  );
}
