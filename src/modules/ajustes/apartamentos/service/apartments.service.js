import api from "../../../../service/api";
import {
  demoFetchApartments,
  demoCreateApartment,
  demoUpdateApartment,
  demoDeactivateApartment,
  demoGetApartment,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const fetchApartments = (condominiumId) =>
  DEMO_MODE
    ? demoFetchApartments(condominiumId)
    : api.get(`/core/apartments?condominium_id=${condominiumId}`);

export const createApartment = (data) =>
  DEMO_MODE ? demoCreateApartment(data) : api.post("/core/apartments", data);

export const updateApartment = (id, data) =>
  DEMO_MODE ? demoUpdateApartment(id, data) : api.put(`/core/apartments/${id}`, data);

export const deactivateApartment = (id) =>
  DEMO_MODE ? demoDeactivateApartment(id) : api.delete(`/core/apartments/${id}`);

export const getApartment = (id) =>
  DEMO_MODE ? demoGetApartment(id) : api.get(`/core/apartments/${id}`);
