import api from "../../../service/api";

export const fetchCorrespondences = (condominiumId) =>
  api.get(`/security/correspondences?condominium_id=${condominiumId}`);

export const createCorrespondence = (data) =>
  api.post(`/security/correspondences`, data);

export const markAsReceived = (id) =>
  api.put(`/security/correspondences/${id}/deliver`);