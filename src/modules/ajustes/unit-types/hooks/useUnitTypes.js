import { useEffect, useState } from "react";
import {
  fetchUnitTypes,
  createUnitType,
  updateUnitType,
  deactivateUnitType,
} from "../service/unitType.service";

export function useUnitTypes(condominiumId) {

  const [unitTypes, setUnitTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUnitTypes = async () => {
    const res = await fetchUnitTypes(condominiumId);
    setUnitTypes(res.data);
  };

  const registerUnitType = async (data) => {
    setLoading(true);
    try {
      await createUnitType({
        condominium_id: condominiumId,
        ...data,
      });
      await loadUnitTypes();
    } finally {
      setLoading(false);
    }
  };

  const editUnitType = async (id, data) => {
    setLoading(true);
    try {
      await updateUnitType(id, data);
      await loadUnitTypes();
    } finally {
      setLoading(false);
    }
  };

  const removeUnitType = async (id) => {
    await deactivateUnitType(id);
    await loadUnitTypes();
  };

  useEffect(() => {
    loadUnitTypes();
  }, [condominiumId]);

  return {
    unitTypes,
    loading,
    registerUnitType,
    editUnitType,
    removeUnitType,
  };
}
