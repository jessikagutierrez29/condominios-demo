const STORAGE_KEY = "condos_cleaning_settings_v1";

const seed = {
  areas: [
    { id: "area_1", name: "Lobby Principal", active: true },
    { id: "area_2", name: "Parqueadero Sótano 1", active: true },
  ],
  checklistByAreaId: {
    area_1: [
      { id: "t_1", text: "Limpieza de vidrios y espejos" },
      { id: "t_2", text: "Desinfección de manijas" },
      { id: "t_3", text: "Aspirado de tapetes" },
    ],
    area_2: [],
  },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return {
      areas: Array.isArray(parsed.areas) ? parsed.areas : seed.areas,
      checklistByAreaId:
        parsed.checklistByAreaId && typeof parsed.checklistByAreaId === "object"
          ? parsed.checklistByAreaId
          : seed.checklistByAreaId,
    };
  } catch {
    return seed;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getCleaningAreasSettings() {
  const s = loadState();
  return [...s.areas];
}

export function createCleaningArea(name) {
  const s = loadState();
  const area = { id: uid("area"), name: name.trim(), active: true };
  const next = {
    ...s,
    areas: [area, ...s.areas],
    checklistByAreaId: { ...s.checklistByAreaId, [area.id]: [] },
  };
  saveState(next);
  return area;
}

export function updateCleaningAreaName(areaId, newName) {
  const s = loadState();
  const nextAreas = s.areas.map((a) =>
    a.id === areaId ? { ...a, name: newName.trim() } : a
  );
  const next = { ...s, areas: nextAreas };
  saveState(next);
  return nextAreas.find((a) => a.id === areaId) || null;
}

export function toggleCleaningAreaActive(areaId) {
  const s = loadState();
  const nextAreas = s.areas.map((a) =>
    a.id === areaId ? { ...a, active: !a.active } : a
  );
  const next = { ...s, areas: nextAreas };
  saveState(next);
  return nextAreas.find((a) => a.id === areaId) || null;
}

export function getChecklistForAreaSettings(areaId) {
  const s = loadState();
  const list = s.checklistByAreaId?.[areaId];
  return Array.isArray(list) ? [...list] : [];
}

export function addChecklistTask(areaId, text) {
  const s = loadState();
  const cleanText = text.trim();
  if (!cleanText) return null;

  const task = { id: uid("t"), text: cleanText };
  const current = Array.isArray(s.checklistByAreaId?.[areaId])
    ? s.checklistByAreaId[areaId]
    : [];

  const next = {
    ...s,
    checklistByAreaId: {
      ...s.checklistByAreaId,
      [areaId]: [task, ...current],
    },
  };

  saveState(next);
  return task;
}

export function removeChecklistTask(areaId, taskId) {
  const s = loadState();
  const current = Array.isArray(s.checklistByAreaId?.[areaId])
    ? s.checklistByAreaId[areaId]
    : [];

  const nextList = current.filter((t) => t.id !== taskId);

  const next = {
    ...s,
    checklistByAreaId: {
      ...s.checklistByAreaId,
      [areaId]: nextList,
    },
  };

  saveState(next);
  return true;
}
