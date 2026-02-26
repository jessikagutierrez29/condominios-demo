import { useEffect, useState } from "react";
import {
  getCleaningRecords,
  createCleaningRecord,
  getChecklistItems,
  toggleChecklistItem,
  completeCleaningRecord,
} from "../service/cleaningRecord.service";

import { getCleaningAreasSettings } from "../../../ajustes/aseo/service/cleaningSettings.service";
import { getOperatives } from "../../usuarios/service/operative.service";

const inputBase = "app-input";

function CleaningRecordPage() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [items, setItems] = useState([]);
  const [areas, setAreas] = useState([]);
  const [operatives, setOperatives] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedOperativeId, setSelectedOperativeId] = useState("");
  const [observationText, setObservationText] = useState("");

  const loadInitialData = async () => {
    const [areasData, operativesData, recordsData] = await Promise.all([
      getCleaningAreasSettings(1),
      getOperatives(1),
      getCleaningRecords(1),
    ]);

    setAreas(areasData.filter((a) => a.is_active));
    setOperatives(operativesData);
    setRecords(recordsData);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadInitialData();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectRecord = async (record) => {
    setSelectedRecord(record);
    setObservationText(record.observations || "");
    const checklist = await getChecklistItems(record.id);
    setItems(checklist);
  };

  const createRecord = async () => {
    if (!selectedAreaId || !selectedOperativeId) return;

    const newRecord = await createCleaningRecord({
      condominium_id: 1,
      cleaning_area_id: selectedAreaId,
      operative_id: selectedOperativeId,
      cleaning_date: new Date().toISOString().slice(0, 10),
    });

    const checklist = await getChecklistItems(newRecord.id);

    setRecords((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
    setItems(checklist);
    setSelectedAreaId("");
    setSelectedOperativeId("");
  };

  const toggleTask = async (id) => {
    await toggleChecklistItem(id);
    const updatedItems = await getChecklistItems(selectedRecord.id);
    setItems(updatedItems);
  };

  const handleFinish = async () => {
    if (!selectedRecord) return;

    const updated = await completeCleaningRecord(selectedRecord.id, {
      observations: observationText,
    });

    setSelectedRecord(updated);
    setRecords((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="app-button-secondary px-4 py-2 text-sm"
          >
            ← Volver
          </button>
        </div>
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Módulo de Aseo
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Control y seguimiento operativo de limpieza
          </p>
        </div>

        {/* NUEVA LIMPIEZA */}
        <div className="app-card p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Nueva Limpieza</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className={inputBase}
            >
              <option value="">Seleccione área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <select
              value={selectedOperativeId}
              onChange={(e) => setSelectedOperativeId(e.target.value)}
              className={inputBase}
            >
              <option value="">Seleccione operario</option>
              {operatives.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.user?.full_name}
                </option>
              ))}
            </select>
          </div>

          <button onClick={createRecord} className="app-button-primary px-8 py-3">
            Crear Limpieza
          </button>
        </div>

        {/* HISTORIAL */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Historial de Limpiezas
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {records.map((r) => (
              <div
                key={r.id}
                onClick={() => selectRecord(r)}
                className={`cursor-pointer p-6 rounded-2xl border transition shadow-sm ${
                  selectedRecord?.id === r.id
                    ? "border-blue-500 bg-blue-50"
                    : r.status === "completed"
                    ? "border-green-200 bg-green-50"
                    : "bg-white hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      {r.cleaning_area?.name}
                    </span>

                    <span className="text-xs text-slate-400 mt-1">
                      {r.operative?.user?.full_name}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      r.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status === "completed" ? "COMPLETADO" : "PENDIENTE"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETALLE */}
        {selectedRecord && (
          <div className="app-card p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedRecord.cleaning_area?.name}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {selectedRecord.operative?.user?.full_name} ·{" "}
                {selectedRecord.created_at
                  ? new Date(selectedRecord.created_at).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : ""}
              </p>
            </div>

            {/* PROGRESO */}
            <div>
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>Progreso</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-3 h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    percent === 100 ? "bg-green-600" : "bg-blue-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* CHECKLIST */}
            <div className="space-y-4">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl"
                >
                  <span
                    className={`${
                      i.completed ? "line-through text-slate-400" : "text-slate-800"
                    }`}
                  >
                    {i.item_name}
                  </span>

                  <input
                    type="checkbox"
                    checked={i.completed}
                    disabled={selectedRecord.status === "completed"}
                    onChange={() => toggleTask(i.id)}
                    className="w-5 h-5 accent-blue-600"
                  />
                </div>
              ))}
            </div>

            {/* OBSERVACIÓN */}
            {selectedRecord.status === "completed" ? (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">
                  Observación Final
                </h3>
                <div className="bg-slate-100 p-5 rounded-2xl text-slate-800">
                  {selectedRecord.observations}
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-2">
                    Observación Final
                  </h3>
                  <textarea
                    className={`${inputBase} min-h-[140px] py-3`}
                    placeholder="Describe el resultado general de la limpieza..."
                    value={observationText}
                    onChange={(e) => setObservationText(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleFinish}
                  disabled={percent !== 100 || !observationText.trim()}
                  className={`w-full py-3 rounded-2xl font-bold transition ${
                    percent === 100 && observationText.trim()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Finalizar Limpieza
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CleaningRecordPage;
