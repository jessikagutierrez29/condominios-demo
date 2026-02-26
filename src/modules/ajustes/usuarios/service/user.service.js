import api from "../../../../service/api";
import {
  demoFetchUsers,
  demoGetUser,
  demoCreateUser,
  demoUpdateUser,
  demoDeactivateUser,
} from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const fetchUsers = (condominiumId) =>
  DEMO_MODE
    ? demoFetchUsers(condominiumId)
    : api.get(`/core/users?condominium_id=${condominiumId}`);


export const getUser = (id) =>
  DEMO_MODE ? demoGetUser(id) : api.get(`/core/users/${id}`);

export const createUser = (data) =>
  DEMO_MODE ? demoCreateUser(data) : api.post("/core/users", data);


export const updateUser = (id, data) =>
  DEMO_MODE ? demoUpdateUser(id, data) : api.put(`/core/users/${id}`, data);

export const deactivateUser = (id) =>
  DEMO_MODE ? demoDeactivateUser(id) : api.delete(`/core/users/${id}`);
