import api from "../../../../service/api";

// AREAS
export async function getCleaningAreasSettings(condominiumId) {
  const res = await api.get(`/security/cleaning-areas/${condominiumId}`);
  return res.data;
}

export async function createCleaningArea(condominiumId, name) {
  const res = await api.post(`/security/cleaning-areas`, {
    condominium_id: condominiumId,
    name,
  });
  return res.data;
}

export async function updateCleaningAreaName(areaId, newName) {
  const res = await api.put(`/security/cleaning-areas/${areaId}`, {
    name: newName,
  });
  return res.data;
}

export async function toggleCleaningAreaActive(areaId, currentState) {
  const res = await api.put(`/security/cleaning-areas/${areaId}`, {
    is_active: !currentState,
  });
  return res.data;
}

// ✅ CHECKLIST PLANTILLA

export async function getChecklistForAreaSettings(areaId) {
  const res = await api.get(
    `/security/cleaning-area-checklists/${areaId}`
  );
  return res.data;
}

export async function addChecklistTask(areaId, text) {
  const res = await api.post(
    `/security/cleaning-area-checklists`,
    {
      cleaning_area_id: areaId,
      item_name: text,
    }
  );
  return res.data;
}

export async function removeChecklistTask(id) {
  const res = await api.delete(
    `/security/cleaning-area-checklists/${id}`
  );
  return res.data;
}