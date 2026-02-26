import api from "../../../../service/api";
import {
  demoFetchCleaningAreas,
  demoCreateCleaningArea,
  demoUpdateCleaningAreaName,
  demoToggleCleaningAreaActive,
  demoFetchChecklistForArea,
  demoAddChecklistTask,
  demoRemoveChecklistTask,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

// AREAS
export async function getCleaningAreasSettings(condominiumId) {
  if (DEMO_MODE) {
    const res = await demoFetchCleaningAreas(condominiumId);
    return res.data;
  }
  const res = await api.get(`/security/cleaning-areas/${condominiumId}`);
  return res.data;
}

export async function createCleaningArea(condominiumId, name) {
  if (DEMO_MODE) {
    const res = await demoCreateCleaningArea(condominiumId, name);
    return res.data;
  }
  const res = await api.post(`/security/cleaning-areas`, {
    condominium_id: condominiumId,
    name,
  });
  return res.data;
}

export async function updateCleaningAreaName(areaId, newName) {
  if (DEMO_MODE) {
    const res = await demoUpdateCleaningAreaName(areaId, newName);
    return res.data;
  }
  const res = await api.put(`/security/cleaning-areas/${areaId}`, {
    name: newName,
  });
  return res.data;
}

export async function toggleCleaningAreaActive(areaId, currentState) {
  if (DEMO_MODE) {
    const res = await demoToggleCleaningAreaActive(areaId, currentState);
    return res.data;
  }
  const res = await api.put(`/security/cleaning-areas/${areaId}`, {
    is_active: !currentState,
  });
  return res.data;
}

// ✅ CHECKLIST PLANTILLA

export async function getChecklistForAreaSettings(areaId) {
  if (DEMO_MODE) {
    const res = await demoFetchChecklistForArea(areaId);
    return res.data;
  }
  const res = await api.get(`/security/cleaning-area-checklists/${areaId}`);
  return res.data;
}

export async function addChecklistTask(areaId, text) {
  if (DEMO_MODE) {
    const res = await demoAddChecklistTask(areaId, text);
    return res.data;
  }
  const res = await api.post(`/security/cleaning-area-checklists`, {
    cleaning_area_id: areaId,
    item_name: text,
  });
  return res.data;
}

export async function removeChecklistTask(id) {
  if (DEMO_MODE) {
    const res = await demoRemoveChecklistTask(id);
    return res.data;
  }
  const res = await api.delete(`/security/cleaning-area-checklists/${id}`);
  return res.data;
}
