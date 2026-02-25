import { useMemo, useRef, useState } from "react";
import {
  createCleaningRecord,
  getChecklistForArea,
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

const TaskRow = ({ label, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="w-full flex items-center justify-between py-4"
  >
    <span className="text-gray-800">{label}</span>
    <span
      className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
        checked ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300"
      }`}
      aria-hidden="true"
    >
      {checked ? "✓" : ""}
    </span>
  </button>
);

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const nowHHMM = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export default function CleaningPage() {
  const areas = useMemo(() => getCleaningAreas(), []);
  const operators = useMemo(() => getCleaningOperators(), []);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    areaId: "",
    operatorId: "",
    date: todayISO(),
    time: nowHHMM(),
    observations: "",
    photoDataUrl: null,
  });

  const checklist = useMemo(() => getChecklistForArea(form.areaId), [form.areaId]);
  const [taskChecked, setTaskChecked] = useState({});

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const onAreaChange = (value) => {
    setField("areaId", value);
    setTaskChecked({});
  };

  const toggleTask = (taskLabel) => {
    setTaskChecked((p) => ({ ...p, [taskLabel]: !p[taskLabel] }));
  };

  const handlePhotoPick = () => fileRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setField("photoDataUrl", reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => setField("photoDataUrl", null);

  const handleCancel = () => {
    setForm({
      areaId: "",
      operatorId: "",
      date: todayISO(),
      time: nowHHMM(),
      observations: "",
      photoDataUrl: null,
    });
    setTaskChecked({});
  };

  const handleSave = () => {
    if (!form.areaId || !form.operatorId) return;

    const selectedTasks = checklist.filter((t) => !!taskChecked[t]);

    createCleaningRecord({
      areaId: form.areaId,
      operatorId: form.operatorId,
      tasks: selectedTasks,
      date: form.date,
      time: form.time,
      observations: form.observations,
      photoDataUrl: form.photoDataUrl,
    });

    handleCancel();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          aria-label="Volver"
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
              onChange={(e) => onAreaChange(e.target.value)}
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
                  {o.name} {o.role ? `(${o.role})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle
            icon="✅"
            title="Checklist de Tareas"
            rightChip="PARAMETRIZABLE POR ÁREA"
          />

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {form.areaId ? (
              checklist.length ? (
                checklist.map((task, idx) => (
                  <div key={task} className="px-5">
                    <TaskRow
                      label={task}
                      checked={!!taskChecked[task]}
                      onToggle={() => toggleTask(task)}
                    />
                    {idx !== checklist.length - 1 && <div className="h-px bg-gray-100" />}
                  </div>
                ))
              ) : (
                <div className="p-5 text-sm text-gray-500">
                  No hay checklist configurado para esta área.
                </div>
              )
            ) : (
              <div className="p-5 text-sm text-gray-500">
                Selecciona un área para cargar el checklist.
              </div>
            )}
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
            <Label>Observaciones de Registro</Label>
            <textarea
              className={`${inputBase} min-h-[120px]`}
              placeholder="Detalles del inicio de la jornada..."
              value={form.observations}
              onChange={(e) => setField("observations", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <SectionTitle icon="📷" title="Evidencia" />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handlePhotoPick}
              className="border-2 border-dashed border-gray-200 rounded-3xl p-6 bg-gray-50 flex flex-col items-center justify-center gap-3 hover:bg-gray-100"
            >
              <div className="text-4xl text-gray-400">📸</div>
              <div className="text-gray-700 font-semibold">TOMAR FOTO</div>
            </button>

            <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white min-h-[160px]">
              {form.photoDataUrl ? (
                <>
                  <img
                    src={form.photoDataUrl}
                    alt="Evidencia"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
                    aria-label="Eliminar evidencia"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  Sin evidencia
                </div>
              )}
            </div>
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

        {(!form.areaId || !form.operatorId) && (
          <div className="text-xs text-gray-500">
            * Para guardar, selecciona un área y un operario.
          </div>
        )}
      </div>
    </div>
  );
}
