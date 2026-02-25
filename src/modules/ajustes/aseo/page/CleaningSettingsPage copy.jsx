import { useMemo, useState } from "react";
import {
  addChecklistTask,
  createCleaningArea,
  getChecklistForAreaSettings,
  getCleaningAreasSettings,
  removeChecklistTask,
  toggleCleaningAreaActive,
  updateCleaningAreaName,
} from "../service/cleaningSettings.service";

const inputBase =
  "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200";

const Label = ({ children }) => (
  <label className="text-sm text-gray-700 font-medium">{children}</label>
);

const Badge = ({ active }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-black ${
      active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
    }`}
  >
    {active ? "ACTIVO" : "INACTIVO"}
  </span>
);

const IconCircle = ({ children }) => (
  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
    {children}
  </div>
);

function CleaningSettingsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const areas = useMemo(() => {
    void refreshKey;
    return getCleaningAreasSettings();
  }, [refreshKey]);

  const [newAreaName, setNewAreaName] = useState("");

  const [editingAreaId, setEditingAreaId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [checklistAreaId, setChecklistAreaId] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");

  const selectedArea = areas.find((a) => a.id === checklistAreaId) || null;

  const checklist = useMemo(() => {
    if (!checklistAreaId) return [];
    void refreshKey;
    return getChecklistForAreaSettings(checklistAreaId);
  }, [checklistAreaId, refreshKey]);

  const bump = () => setRefreshKey((k) => k + 1);

  const onCreateArea = () => {
    if (!newAreaName.trim()) return;
    createCleaningArea(newAreaName);
    setNewAreaName("");
    bump();
  };

  const startEdit = (area) => {
    setEditingAreaId(area.id);
    setEditingName(area.name);
  };

  const cancelEdit = () => {
    setEditingAreaId(null);
    setEditingName("");
  };

  const saveEdit = () => {
    if (!editingAreaId) return;
    if (!editingName.trim()) return;
    updateCleaningAreaName(editingAreaId, editingName);
    cancelEdit();
    bump();
  };

  const toggleActive = (areaId) => {
    toggleCleaningAreaActive(areaId);
    bump();
  };

  const openChecklist = (areaId) => {
    setChecklistAreaId(areaId);
    setNewTaskText("");
  };

  const closeChecklist = () => {
    setChecklistAreaId(null);
    setNewTaskText("");
  };

  const addTask = () => {
    if (!checklistAreaId) return;
    if (!newTaskText.trim()) return;
    addChecklistTask(checklistAreaId, newTaskText);
    setNewTaskText("");
    bump();
  };

  const deleteTask = (taskId) => {
    if (!checklistAreaId) return;
    removeChecklistTask(checklistAreaId, taskId);
    bump();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 pt-4 pb-3 flex items-start gap-3 max-w-3xl mx-auto">
          <button
            type="button"
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center mt-0.5"
            aria-label="Volver"
            onClick={() => window.history.back()}
          >
            ←
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-blue-700">
              Parametrización de Aseo
            </h1>
            <div className="text-xs tracking-widest text-gray-500 font-bold">
              AJUSTES DE CONDOMINIO
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 max-w-3xl mx-auto">
        <div className="pt-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Gestión de Áreas</h2>
          <p className="text-gray-600 mt-2">
            Configure las zonas y protocolos de limpieza de su copropiedad.
          </p>
        </div>

        <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-black">
              +
            </div>
            <div className="text-lg font-extrabold text-gray-900">Nueva Área</div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Nombre del área</Label>
            <input
              className={inputBase}
              placeholder="Ej: Lobby, Gimnasio, Piscina..."
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={onCreateArea}
            className="mt-4 w-full bg-blue-600 text-white rounded-2xl py-4 font-extrabold shadow-lg hover:bg-blue-700"
          >
            Guardar Área
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-extrabold text-gray-900">Áreas Configuradas</h3>

          <div className="mt-4 space-y-4">
            {areas.map((a) => {
              const isEditing = editingAreaId === a.id;

              return (
                <div
                  key={a.id}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-center gap-4">
                    <IconCircle>{a.name?.[0]?.toUpperCase() || "A"}</IconCircle>

                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <input
                            className={inputBase}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={saveEdit}
                              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-extrabold text-gray-900">
                              {a.name}
                            </div>
                            <Badge active={a.active} />
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleActive(a.id)}
                              className="text-xs font-extrabold text-blue-700 hover:underline"
                            >
                              {a.active ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(a)}
                        className="w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center"
                        aria-label="Editar"
                        title="Editar"
                      >
                        ✎
                      </button>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => openChecklist(a.id)}
                      className="mt-4 w-full rounded-2xl py-3 font-extrabold border border-blue-600 text-blue-700 hover:bg-blue-50"
                    >
                      Configurar Checklist
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedArea && (
          <div className="mt-8 bg-white rounded-3xl shadow-md border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                  ☑
                </div>
                <div className="text-lg font-extrabold text-gray-900">
                  Checklist: {selectedArea.name}
                </div>
              </div>

              <button
                type="button"
                onClick={closeChecklist}
                className="w-10 h-10 rounded-2xl hover:bg-gray-100 flex items-center justify-center"
                aria-label="Cerrar"
                title="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex gap-3 items-center">
              <input
                className={inputBase}
                placeholder="Nueva tarea..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
              />
              <button
                type="button"
                onClick={addTask}
                className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 flex items-center justify-center"
                aria-label="Agregar tarea"
                title="Agregar"
              >
                +
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {checklist.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Aún no hay tareas configuradas para esta área.
                </div>
              ) : (
                checklist.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#F7F9FC] border border-gray-100 rounded-2xl px-4 py-4 flex items-center gap-3"
                  >
                    <div className="flex-1 text-gray-900 font-medium">{t.text}</div>
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      className="w-10 h-10 rounded-2xl hover:bg-red-50 text-red-500 flex items-center justify-center"
                      aria-label="Eliminar"
                      title="Eliminar"
                    >
                      🗑
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CleaningSettingsPage;
