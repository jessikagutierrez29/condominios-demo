import api from "../../../../service/api";

export const fetchApartments = (condominiumId) =>
  api.get(`/core/apartments?condominium_id=${condominiumId}`);

export const createApartment = (data) =>
  api.post("/core/apartments", data);

export const updateApartment = (id, data) =>
  api.put(`/core/apartments/${id}`, data);

export const deactivateApartment = (id) =>
  api.delete(`/core/apartments/${id}`);

export const getApartment = (id) =>
  api.get(`/core/apartments/${id}`);
