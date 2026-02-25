import api from "../../../service/api";

// AREAS
export async function getCleaningAreas(condominiumId) {
  const res = await api.get(`/security/cleaning-areas/${condominiumId}`);
  return res.data;
}

// OPERADORES
export async function getCleaningOperators(condominiumId) {
  const res = await api.get(
    `/core/operatives?condominium_id=${condominiumId}`
  );
  return res.data;
}

// CREAR REGISTRO
export async function createCleaningRecord(payload) {
  const res = await api.post(`/security/cleaning-records`, payload);
  return res.data;
}
