import api from "../../../../service/api";

export const fetchVehicleTypes = (condominiumId) =>
  api.get(`/security/vehicle-types?condominium_id=${condominiumId}`);

export const createVehicleType = (data) =>
  api.post("/security/vehicle-types", data);

export const updateVehicleType = (id, data) =>
  api.put(`/security/vehicle-types/${id}`, data);

export const deactivateVehicleType = (id) =>
  api.delete(`/security/vehicle-types/${id}`);
