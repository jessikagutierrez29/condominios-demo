import api from "../../../../service/api";
import {
  demoFetchUnitTypes,
  demoCreateUnitType,
  demoUpdateUnitType,
  demoDeactivateUnitType,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const fetchUnitTypes = (condominiumId) =>
  DEMO_MODE
    ? demoFetchUnitTypes(condominiumId)
    : api.get(`/core/unit-types?condominium_id=${condominiumId}`);

export const createUnitType = (data) =>
  DEMO_MODE ? demoCreateUnitType(data) : api.post("/core/unit-types", data);

export const updateUnitType = (id, data) =>
  DEMO_MODE ? demoUpdateUnitType(id, data) : api.put(`/core/unit-types/${id}`, data);

export const deactivateUnitType = (id) =>
  DEMO_MODE ? demoDeactivateUnitType(id) : api.delete(`/core/unit-types/${id}`);
