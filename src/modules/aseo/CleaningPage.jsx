import { useMemo, useRef, useState, useEffect } from "react";
import {
  createCleaningRecord,
  getCleaningAreas,
  getCleaningOperators,
} from "./service/cleaning.service";

const inputBase =
  "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200";

const Label = ({ children }) => (
  <label className="text-sm text-gray-700 font-medium">{children}</label>
);

const SectionTitle = ({ icon, title, rightChip }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>

    {rightChip ? (
      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
        {rightChip}
      </span>
    ) : null}
  </div>
);

const todayISO = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const nowHHMM = () => {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
};

export default function CleaningPage() {
  const [areas, setAreas] = useState([]);
  const [operators, setOperators] = useState([]);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    areaId: "",
    operatorId: "",
    date: todayISO(),
    time: nowHHMM(),
    observations: "",
    photoDataUrl: null,
  });

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const areasData = await getCleaningAreas(1);
      const operatorsData = await getCleaningOperators(1);

      setAreas(areasData);
      setOperators(operatorsData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleCancel = () => {
    setForm({
      areaId: "",
      operatorId: "",
      date: todayISO(),
      time: nowHHMM(),
      observations: "",
      photoDataUrl: null,
    });
  };

  const handleSave = async () => {
  if (!form.areaId || !form.operatorId) return;

  try {
    await createCleaningRecord({
      condominium_id: 1,
      cleaning_area_id: form.areaId,
      operative_id: form.operatorId,
      cleaning_date: form.date,
      observations: form.observations,
    });

    handleCancel();
    alert("Registro guardado correctamente");
  } catch (error) {
    console.error(error);
    alert("Error guardando registro");
  }
};


  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          onClick={() => window.history.back()}
        >
          ←
        </button>

        <h1 className="text-xl font-extrabold text-gray-900">
          Seguimiento de Aseo y Limpieza
        </h1>
      </div>

      <div className="px-4 pb-10 max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <SectionTitle icon="⚙️" title="Configuración" />

          <div className="space-y-2">
            <Label>Área de Limpieza</Label>
            <select
              className={inputBase}
              value={form.areaId}
              onChange={(e) => setField("areaId", e.target.value)}
            >
              <option value="">Seleccione el área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Operario Responsable</Label>
            <select
              className={inputBase}
              value={form.operatorId}
              onChange={(e) => setField("operatorId", e.target.value)}
            >
              <option value="">Seleccione el operario</option>
              {operators.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.user?.name} ({o.position})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle icon="📅" title="Registro" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <input
                type="date"
                className={inputBase}
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Hora</Label>
              <input
                type="time"
                className={inputBase}
                value={form.time}
                onChange={(e) => setField("time", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <textarea
              className={`${inputBase} min-h-[120px]`}
              value={form.observations}
              onChange={(e) => setField("observations", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 font-extrabold text-gray-800 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-extrabold shadow-lg hover:bg-blue-700"
          >
            Guardar Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
}
