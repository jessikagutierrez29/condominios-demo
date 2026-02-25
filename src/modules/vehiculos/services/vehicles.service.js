import api from '../../../service/api';

export const fetchVehicles = async (condominiumId) =>
  api.get(`/security/vehicle-entries/${condominiumId}`);

export const registerVehicleEntry = async (data) =>
  api.post(`/security/vehicle-entries`, data);

export const registerVehicleExit = async (entryId) =>
  api.put(`/security/vehicle-entries/${entryId}`);