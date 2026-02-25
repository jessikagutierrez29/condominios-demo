import { useEffect, useState } from "react";
import {
  fetchApartments,
  createApartment,
  updateApartment,
  deactivateApartment,
  getApartment, 
} from "../service/apartments.service";

export function useApartments(condominiumId) {

  const [apartments, setApartments] = useState([]);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ==============================
     LISTADO
  ============================== */

  const loadApartments = async () => {
    if (!condominiumId) return;

    setLoading(true);
    try {
      const res = await fetchApartments(condominiumId);
      setApartments(res.data);
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     DETALLE
  ============================== */

  const loadApartmentById = async (id) => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await getApartment(id);
      setApartment(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     CREATE
  ============================== */

  const registerApartment = async (data) => {
    setLoading(true);
    try {
      await createApartment({
        condominium_id: condominiumId,
        ...data,
      });
      await loadApartments();
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     UPDATE
  ============================== */

  const editApartment = async (id, data) => {
    setLoading(true);
    try {
      await updateApartment(id, data);
      await loadApartments();
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     DELETE (soft)
  ============================== */

  const removeApartment = async (id) => {
    setLoading(true);
    try {
      await deactivateApartment(id);
      await loadApartments();
    } finally {
      setLoading(false);
    }
  };

  /* ==============================
     AUTO LOAD LIST
  ============================== */

  useEffect(() => {
    if (!condominiumId) return;
    loadApartments();
  }, [condominiumId]);

  return {
    apartments,
    apartment,
    loading,
    loadApartments,
    loadApartmentById,
    registerApartment,
    editApartment,
    removeApartment,
  };
}
