import api from "../../../../service/api";
import {
  demoFetchCleaningRecords,
  demoCreateCleaningRecord,
  demoGetChecklistItems,
  demoToggleChecklistItem,
  demoCompleteCleaningRecord,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

/* ==============================
   RECORDS
================================ */

// Obtener records por condominio
export async function getCleaningRecords(condominiumId) {
  if (DEMO_MODE) {
    const res = await demoFetchCleaningRecords(condominiumId);
    return res.data;
  }
  const res = await api.get(`/security/cleaning-records/${condominiumId}`);
  return res.data;
}

// Crear nuevo record
export async function createCleaningRecord(payload) {
  if (DEMO_MODE) {
    const res = await demoCreateCleaningRecord(payload);
    return res.data;
  }
  const res = await api.post(`/security/cleaning-records`, payload);
  return res.data;
}

// Actualizar record (observación / hora)
export async function updateCleaningRecord(id, payload) {
  const res = await api.put(`/security/cleaning-records/${id}`, payload);
  return res.data;
}

// Finalizar limpieza
export async function completeCleaningRecord(id, data) {
  if (DEMO_MODE) {
    const res = await demoCompleteCleaningRecord(id, data);
    return res.data;
  }
  const res = await api.put(`/security/cleaning-records/${id}/complete`, data);
  return res.data;
}


/* ==============================
   CHECKLIST
================================ */

// Obtener checklist items por record
export async function getChecklistItems(recordId) {
  if (DEMO_MODE) {
    const res = await demoGetChecklistItems(recordId);
    return res.data;
  }
  const res = await api.get(`/security/cleaning-checklists/${recordId}`);
  return res.data;
}

// Toggle tarea
export async function toggleChecklistItem(id) {
  if (DEMO_MODE) {
    const res = await demoToggleChecklistItem(id);
    return res.data;
  }
  const res = await api.put(`/security/cleaning-checklists/toggle/${id}`);
  return res.data;
}
