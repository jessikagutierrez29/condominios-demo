import api from "../../../../service/api";
import {
  demoFetchVehicleTypes,
  demoCreateVehicleType,
  demoUpdateVehicleType,
  demoDeactivateVehicleType,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const fetchVehicleTypes = (condominiumId) =>
  DEMO_MODE
    ? demoFetchVehicleTypes(condominiumId)
    : api.get(`/security/vehicle-types?condominium_id=${condominiumId}`);

export const createVehicleType = (data) =>
  DEMO_MODE ? demoCreateVehicleType(data) : api.post("/security/vehicle-types", data);

export const updateVehicleType = (id, data) =>
  DEMO_MODE ? demoUpdateVehicleType(id, data) : api.put(`/security/vehicle-types/${id}`, data);

export const deactivateVehicleType = (id) =>
  DEMO_MODE ? demoDeactivateVehicleType(id) : api.delete(`/security/vehicle-types/${id}`);
