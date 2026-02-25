import { useEffect, useRef, useState } from "react";
import api from "../../../../service/api";
import {
  createVehicleIncident,
  fetchVehicleIncidents,
} from "../service/vehicleIncidents.service";

const condominiumId = 1;

const inputBase =
  "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200";

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
      {icon}
    </div>
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
  </div>
);

const Label = ({ children }) => (
  <label className="text-sm text-gray-700 font-medium">{children}</label>
);

const IncidentOption = ({ icon, label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full border rounded-2xl px-4 py-4 flex items-center justify-between transition ${
      selected
        ? "border-blue-600 bg-white shadow-sm"
        : "border-gray-200 bg-white hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="text-xl">{icon}</div>
      <div className="text-base font-semibold text-gray-900">{label}</div>
    </div>
    <div
      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
        selected ? "border-blue-600" : "border-gray-300"
      }`}
    >
      {selected ? <div className="w-3 h-3 rounded-full bg-blue-600" /> : null}
    </div>
  </button>
);

const VehicleIncidentPage = () => {
  const fileRef = useRef(null);

  const [apartments, setApartments] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [form, setForm] = useState({
    tipoVehiculo: "",
    placa: "",
    tipoUnidad: "",
    numeroUnidad: "",
    tipoNovedad: "ROBO",
    observaciones: "",
    photoList: [],
  });

  // =============================
  // CARGAR DATA INICIAL
  // =============================
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [apartmentsRes, vehicleTypesRes] = await Promise.all([
        api.get(`/core/apartments?condominium_id=${condominiumId}`),
        api.get(`/security/vehicle-types`),
      ]);

      setApartments(apartmentsRes.data);
      setVehicleTypes(vehicleTypesRes.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const setField = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const pickPhoto = () => fileRef.current?.click();

  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({
        ...p,
        photoList: [...p.photoList, reader.result],
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // =============================
  // ENVIAR INCIDENTE
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.placa.trim() || !form.numeroUnidad) return;

    try {
      const incidentTypeMap = {
        ROBO: "unauthorized",
        DANIO: "damage",
        OTRO: "other",
      };

      const formData = new FormData();
      formData.append("condominium_id", condominiumId);
      formData.append("plate", form.placa.trim().toUpperCase());
      formData.append("apartment_id", form.numeroUnidad);
      formData.append(
        "incident_type",
        incidentTypeMap[form.tipoNovedad] || "other"
      );
      formData.append("observations", form.observaciones || "");

      if (form.photoList.length) {
        const blob = await fetch(form.photoList[0]).then((r) => r.blob());
        formData.append("evidence", blob, "evidence.jpg");
      }

      await createVehicleIncident(formData);

      setForm({
        tipoVehiculo: "",
        placa: "",
        tipoUnidad: "",
        numeroUnidad: "",
        tipoNovedad: "ROBO",
        observaciones: "",
        photoList: [],
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // =============================
  // OBTENER TIPOS DE UNIDAD ÚNICOS
  // =============================
  const uniqueUnitTypes = [
    ...new Map(
      apartments.map((apt) => [
        apt.unit_type?.id,
        apt.unit_type?.name,
      ])
    ).values(),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
        <button
          type="button"
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
          onClick={() => window.history.back()}
        >
          ←
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">
          Novedades Vehiculares
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 max-w-3xl mx-auto space-y-6">

        {/* INFORMACIÓN */}
        <div className="pt-6 space-y-4">
          <SectionTitle icon="🚙" title="Información del Vehículo" />

          {/* TIPO VEHÍCULO */}
          <div className="space-y-2">
            <Label>Tipo de vehículo</Label>
            <select
              className={inputBase}
              value={form.tipoVehiculo}
              onChange={(e) => setField("tipoVehiculo", e.target.value)}
            >
              <option value="">Seleccione tipo</option>
              {vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* PLACA */}
          <div className="space-y-2">
            <Label>Placa del vehículo</Label>
            <input
              className={inputBase}
              placeholder="ABC-123"
              value={form.placa}
              onChange={(e) => setField("placa", e.target.value)}
            />
          </div>

          {/* UNIDAD */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de unidad</Label>
              <select
                className={inputBase}
                value={form.tipoUnidad}
                onChange={(e) => {
                  setField("tipoUnidad", e.target.value);
                  setField("numeroUnidad", "");
                }}
              >
                <option value="">Seleccione tipo</option>
                {uniqueUnitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Número</Label>
              <select
                className={inputBase}
                value={form.numeroUnidad}
                onChange={(e) => setField("numeroUnidad", e.target.value)}
              >
                <option value="">Seleccione unidad</option>
                {apartments
                  .filter(
                    (a) => a.unit_type?.name === form.tipoUnidad
                  )
                  .map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.number}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* TIPO NOVEDAD */}
        <div className="space-y-3">
          <SectionTitle icon="⚠️" title="Tipo de Novedad" />

          <IncidentOption
            icon="🛡️"
            label="Robo"
            selected={form.tipoNovedad === "ROBO"}
            onClick={() => setField("tipoNovedad", "ROBO")}
          />
          <IncidentOption
            icon="💔"
            label="Daño"
            selected={form.tipoNovedad === "DANIO"}
            onClick={() => setField("tipoNovedad", "DANIO")}
          />
          <IncidentOption
            icon="…"
            label="Otro"
            selected={form.tipoNovedad === "OTRO"}
            onClick={() => setField("tipoNovedad", "OTRO")}
          />
        </div>

        {/* OBSERVACIONES */}
        <div className="space-y-3">
        <SectionTitle icon="📝" title="Observaciones Generales" />

        <textarea
            className={`${inputBase} min-h-[140px]`}
            placeholder="Describa los detalles..."
            value={form.observaciones}
            onChange={(e) => setField("observaciones", e.target.value)}
        />
        </div>

        {/* EVIDENCIA */}
        <div className="space-y-3">
        <SectionTitle icon="📷" title="Evidencia Fotográfica" />

        <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoChange}
        />

        <div className="flex gap-3 overflow-x-auto">
            <button
            type="button"
            onClick={pickPhoto}
            className="min-w-[120px] h-[96px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
            >
            <div className="text-2xl text-gray-400">📸</div>
            <div className="text-xs font-extrabold text-gray-700">AÑADIR</div>
            </button>

            {form.photoList.map((src, idx) => (
            <div
                key={idx}
                className="relative min-w-[120px] h-[96px] rounded-2xl overflow-hidden border border-gray-200"
            >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                type="button"
                onClick={() =>
                    setForm((p) => ({
                    ...p,
                    photoList: p.photoList.filter((_, i) => i !== idx),
                    }))
                }
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                ✕
                </button>
            </div>
            ))}
        </div>
        </div>


        {/* BOTÓN */}
        <div className="fixed left-0 right-0 bottom-6 z-50 flex justify-center px-4">
          <button
            type="submit"
            className="w-full max-w-3xl bg-blue-600 text-white rounded-2xl py-4 font-extrabold shadow-2xl hover:bg-blue-700 transition"
          >
            Reportar Novedad
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleIncidentPage;
