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
    <div className="app-card p-4 space-y-4">
      <h2 className="font-semibold text-slate-800">
        Registrar tipo de unidad
      </h2>

      <input
        type="text"
        placeholder="Ej. Apartamento"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="app-input"
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
        className="app-button-primary w-full py-3 font-semibold"
      >
        {loading ? "Guardando..." : "Crear tipo"}
      </button>
    </div>
  );
}
