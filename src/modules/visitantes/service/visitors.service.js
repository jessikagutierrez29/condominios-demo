import api from "../../../service/api";
import {
  demoFetchApartments,
  demoFetchVisits,
  demoCreateVisit,
  demoCheckoutVisit,
} from "../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

/* ===========================
   APARTMENTS
=========================== */

export const fetchApartments = (condominiumId) => {
  if (DEMO_MODE) {
    return demoFetchApartments(condominiumId);
  }
  return api.get(`/core/apartments`, {
    params: { condominium_id: condominiumId },
  });
};

/* ===========================
   VISITS
=========================== */

export const fetchVisits = (condominiumId) => {
  if (DEMO_MODE) {
    return demoFetchVisits(condominiumId);
  }
  return api.get(`/security/visits/${condominiumId}`);
};

export const createVisit = (formData) => {
  if (DEMO_MODE) {
    const payload =
      formData instanceof FormData
        ? Object.fromEntries(formData.entries())
        : formData;
    return demoCreateVisit({
      condominium_id: Number(payload.condominium_id),
      apartment_id: Number(payload.apartment_id),
      full_name: payload.full_name,
      document_number: payload.document_number,
      phone: payload.phone,
      destination: payload.destination,
      background_check: Boolean(Number(payload.background_check)),
      carried_items: payload.carried_items,
    });
  }
  return api.post(`/security/visits`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const checkoutVisit = (visitId) => {
  if (DEMO_MODE) {
    return demoCheckoutVisit(visitId);
  }
  return api.put(`/security/visits/checkout/${visitId}`);
};
