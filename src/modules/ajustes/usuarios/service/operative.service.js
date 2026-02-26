import api from "../../../../service/api";
import { demoFetchOperatives } from "../../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

export const getOperatives = async (condominiumId) => {
  if (DEMO_MODE) {
    return demoFetchOperatives(condominiumId);
  }
  const res = await api.get(`/core/operatives?condominium_id=${condominiumId}`);
  return res.data;
};
