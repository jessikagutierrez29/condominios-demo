import { useEffect, useState } from "react";
import { fetchApartments, fetchVisits, createVisit, checkoutVisit } from "../service/visitors.service";

export function useVisitors(condominiumId) {
  const [apartments, setApartments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApartments = async () => {
    const res = await fetchApartments(condominiumId);
    setApartments(res.data);
  };

  const loadVisits = async () => {
    const res = await fetchVisits(condominiumId);
    setVisits(res.data);
  };

  const registerVisit = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("condominium_id", condominiumId);
      formData.append("apartment_id", values.apartment_id);
      formData.append("full_name", values.full_name);
      formData.append("document_number", values.document_number || "");
      formData.append("phone", values.phone || "");
      formData.append("destination", values.destination || "");
      formData.append("background_check", values.background_check ? 1 : 0);
      formData.append("carried_items", values.carried_items || "");

      if (values.photo) {
        formData.append("photo", values.photo);
      }
      
      await createVisit(formData);
      await loadVisits();

    } finally {
      setLoading(false);
    }
  };

  const checkout = async (visitId) => {
    await checkoutVisit(visitId);
    await loadVisits();
  };

  useEffect(() => {
    loadApartments();
    loadVisits();
  }, [condominiumId]);

  return {
    apartments,
    visits,
    loading,
    registerVisit,
    checkout,
  };
}
