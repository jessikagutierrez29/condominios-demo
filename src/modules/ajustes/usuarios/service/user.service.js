import api from "../../../../service/api";

export const fetchUsers = (condominiumId) =>
  api.get(`/core/users?condominium_id=${condominiumId}`);


export const getUser = (id) =>
  api.get(`/core/users/${id}`);

export const createUser = (data) =>
  api.post("/core/users", data);


export const updateUser = (id, data) =>
  api.put(`/core/users/${id}`, data);

export const deactivateUser = (id) =>
  api.delete(`/core/users/${id}`);
