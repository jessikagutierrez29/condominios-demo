import api from "../../../../service/api";

export const getOperatives = async (condominiumId) => {
  const res = await api.get(
    `/core/operatives?condominium_id=${condominiumId}`
  );
  return res.data;
};