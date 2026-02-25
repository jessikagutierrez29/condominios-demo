import api from '../../../../service/api';

export const fetchVehicleIncidents = async (condominiumId) =>
  api.get(`/security/vehicle-incidents/${condominiumId}`);

export const createVehicleIncident = async (data) =>
  api.post(`/security/vehicle-incidents`, data);

export const resolveVehicleIncident = async (incidentId) =>
  api.put(`/security/vehicle-incidents/resolve/${incidentId}`);

export const deleteVehicleIncident = async (incidentId) =>
  api.delete(`/security/vehicle-incidents/${incidentId}`);
