import api from "../../../../service/api";

export const fetchUnitTypes = (condominiumId) =>
  api.get(`/core/unit-types?condominium_id=${condominiumId}`);

export const createUnitType = (data) =>
  api.post("/core/unit-types", data);

export const updateUnitType = (id, data) =>
  api.put(`/core/unit-types/${id}`, data);

export const deactivateUnitType = (id) =>
  api.delete(`/core/unit-types/${id}`);