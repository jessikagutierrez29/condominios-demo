import { useEffect, useState } from "react";
import {
  createCleaningArea,
  getCleaningAreasSettings,
  toggleCleaningAreaActive,
  updateCleaningAreaName,
  getChecklistForAreaSettings,
  addChecklistTask,
  removeChecklistTask,
} from "../service/cleaningSettings.service";

const inputBase = "app-input";

const Label = ({ children }) => (
  <label className="text-sm text-slate-700 font-medium">{children}</label>
);

const Badge = ({ active }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-black ${
      active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
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
  const [areas, setAreas] = useState([]);
  const [newAreaName, setNewAreaName] = useState("");

  const [editingAreaId, setEditingAreaId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [checklistAreaId, setChecklistAreaId] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const loadAreas = async () => {
    const data = await getCleaningAreasSettings(1);
    setAreas(data);
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadAreas();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onCreateArea = async () => {
    if (!newAreaName.trim()) return;
    await createCleaningArea(1, newAreaName);
    setNewAreaName("");
    loadAreas();
  };

  const startEdit = (area) => {
    setEditingAreaId(area.id);
    setEditingName(area.name);
  };

  const cancelEdit = () => {
    setEditingAreaId(null);
    setEditingName("");
  };

  const saveEdit = async () => {
    if (!editingAreaId || !editingName.trim()) return;
    await updateCleaningAreaName(editingAreaId, editingName);
    cancelEdit();
    loadAreas();
  };

  const toggleActive = async (areaId) => {
    const area = areas.find((a) => a.id === areaId);
    if (!area) return;

    await toggleCleaningAreaActive(areaId, area.is_active);
    loadAreas();
  };

  const openChecklist = async (areaId) => {
    if (checklistAreaId === areaId) {
      setChecklistAreaId(null);
      setChecklist([]);
      return;
    }

    setChecklistAreaId(areaId);
    const data = await getChecklistForAreaSettings(areaId);
    setChecklist(data);
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;

    await addChecklistTask(checklistAreaId, newTaskText);
    setNewTaskText("");

    const data = await getChecklistForAreaSettings(checklistAreaId);
    setChecklist(data);
  };

  const deleteTask = async (taskId) => {
    await removeChecklistTask(taskId);

    const data = await getChecklistForAreaSettings(checklistAreaId);
    setChecklist(data);
  };

  return (
    <div className="w-full">
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 pt-4 pb-3 flex items-start gap-3 max-w-3xl mx-auto">
          <button
            type="button"
            className="app-button-secondary px-4 py-2 text-sm"
            onClick={() => window.history.back()}
          >
            ← Volver
          </button>

          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Parametrización de Aseo
            </h1>
            <div className="text-xs tracking-widest text-slate-500 font-bold">
              AJUSTES DE CONDOMINIO
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 max-w-3xl mx-auto">
        <div className="pt-6">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Gestión de Áreas
          </h2>
          <p className="text-slate-600 mt-2">
            Configure las zonas y protocolos de limpieza de su copropiedad.
          </p>
        </div>

        {/* CREAR AREA */}
        <div className="mt-6 app-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 font-black">
              +
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              Nueva Área
            </div>
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
            className="mt-4 app-button-primary w-full py-4 font-extrabold"
          >
            Guardar Área
          </button>
        </div>

        {/* LISTA AREAS */}
        <div className="mt-8 space-y-4">
          {areas.map((a) => {
            const isEditing = editingAreaId === a.id;

            return (
              <div key={a.id} className="app-card p-5">
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
                            onClick={saveEdit}
                            className="app-button-primary px-4 py-2 text-sm font-bold"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="app-button-secondary px-4 py-2 text-sm font-bold"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-extrabold text-slate-900">
                            {a.name}
                          </div>
                          <Badge active={a.is_active} />
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(a.id)}
                            className="text-xs font-extrabold text-blue-700 hover:underline"
                          >
                            {a.is_active ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => startEdit(a)}
                      className="w-10 h-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center"
                    >
                      ✏️
                    </button>
                  )}
                </div>

                {!isEditing && (
                  <>
                    <button
                      onClick={() => openChecklist(a.id)}
                      className="mt-4 app-button-secondary w-full py-3 font-extrabold text-blue-700 border-blue-600"
                    >
                      Configurar Checklist
                    </button>

                    {checklistAreaId === a.id && (
                      <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        {checklist.length === 0 && (
                          <div className="text-sm text-slate-500 mb-3">
                            No hay tareas configuradas.
                          </div>
                        )}

                        {checklist.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center bg-white p-3 rounded-xl mb-2 shadow-sm"
                          >
                            <span>{item.item_name}</span>
                            <button
                              onClick={() => deleteTask(item.id)}
                              className="text-red-500 font-bold"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}

                        <div className="flex gap-2 mt-3">
                          <input
                            className={inputBase}
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Nueva tarea..."
                          />
                          <button
                            onClick={addTask}
                            className="app-button-primary px-4 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CleaningSettingsPage;
