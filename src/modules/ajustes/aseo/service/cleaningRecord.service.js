import api from "../../../../service/api";

/* ==============================
   RECORDS
================================ */

// Obtener records por condominio
export async function getCleaningRecords(condominiumId) {
  const res = await api.get(`/security/cleaning-records/${condominiumId}`);
  return res.data;
}

// Crear nuevo record
export async function createCleaningRecord(payload) {
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
  const res = await api.put(
    `/security/cleaning-records/${id}/complete`,
    data
  );
  return res.data;
}


/* ==============================
   CHECKLIST
================================ */

// Obtener checklist items por record
export async function getChecklistItems(recordId) {
  const res = await api.get(`/security/cleaning-checklists/${recordId}`);
  return res.data;
}

// Toggle tarea
export async function toggleChecklistItem(id) {
  const res = await api.put(`/security/cleaning-checklists/toggle/${id}`);
  return res.data;
}