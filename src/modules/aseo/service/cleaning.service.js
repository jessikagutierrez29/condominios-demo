import api from "../../../service/api";
import {
  demoFetchCleaningAreas,
  demoFetchOperatives,
  demoCreateCleaningRecord,
} from "../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

// AREAS
export async function getCleaningAreas(condominiumId) {
  if (DEMO_MODE) {
    const res = await demoFetchCleaningAreas(condominiumId);
    return res.data;
  }
  const res = await api.get(`/security/cleaning-areas/${condominiumId}`);
  return res.data;
}

// OPERADORES
export async function getCleaningOperators(condominiumId) {
  if (DEMO_MODE) {
    return demoFetchOperatives(condominiumId);
  }
  const res = await api.get(`/core/operatives?condominium_id=${condominiumId}`);
  return res.data;
}

// CREAR REGISTRO
export async function createCleaningRecord(payload) {
  if (DEMO_MODE) {
    const res = await demoCreateCleaningRecord(payload);
    return res.data;
  }
  const res = await api.post(`/security/cleaning-records`, payload);
  return res.data;
}
