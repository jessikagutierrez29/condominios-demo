import api from "../../../service/api";

/* ===========================
   APARTMENTS
=========================== */

export const fetchApartments = (condominiumId) => {
  return api.get(`/core/apartments`, {
    params: { condominium_id: condominiumId },
  });
};

/* ===========================
   VISITS
=========================== */

export const fetchVisits = (condominiumId) => {
  return api.get(`/security/visits/${condominiumId}`);
};

export const createVisit = (formData) => {
  return api.post(`/security/visits`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const checkoutVisit = (visitId) => {
  return api.put(`/security/visits/checkout/${visitId}`);
};