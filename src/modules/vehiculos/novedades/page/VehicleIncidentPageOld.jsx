import { useMemo, useRef, useState } from "react";
import {
  createVehicleIncident,
  getVehicleIncidents,
} from "../service/vehicleIncidents.service";

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

const formatFull = (iso) => {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${date} - ${time}`;
  } catch {
    return "--";
  }
};

const VehicleIncidentPage = () => {
  const fileRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [form, setForm] = useState({
    tipoVehiculo: "",
    placa: "",
    tipoUnidad: "Apartamento",
    numeroUnidad: "",
    tipoNovedad: "ROBO",
    observaciones: "",
    photoList: [],
    createdAt: new Date().toISOString(),
  });

  const incidents = useMemo(() => {
    void refreshKey;
    return getVehicleIncidents();
  }, [refreshKey]);

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

  const removePhotoAt = (idx) => {
    setForm((p) => ({
      ...p,
      photoList: p.photoList.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.tipoVehiculo || !form.placa.trim() || !form.numeroUnidad.trim())
      return;

    createVehicleIncident({
      ...form,
      placa: form.placa.trim().toUpperCase(),
      numeroUnidad: form.numeroUnidad.trim(),
      createdAt: new Date().toISOString(),
    });

    setForm({
      tipoVehiculo: "",
      placa: "",
      tipoUnidad: "Apartamento",
      numeroUnidad: "",
      tipoNovedad: "ROBO",
      observaciones: "",
      photoList: [],
      createdAt: new Date().toISOString(),
    });

    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
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

        {/* Información */}
        <div className="pt-6 space-y-4">
          <SectionTitle icon="🚙" title="Información del Vehículo" />

          <div className="space-y-2">
            <Label>Tipo de vehículo</Label>
            <select
              className={inputBase}
              value={form.tipoVehiculo}
              onChange={(e) => setField("tipoVehiculo", e.target.value)}
            >
              <option value="">Seleccione un tipo</option>
              <option>Automóvil</option>
              <option>Motocicleta</option>
              <option>Bicicleta</option>
              <option>Camioneta</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Placa del vehículo</Label>
            <input
              className={inputBase}
              placeholder="ABC-123"
              value={form.placa}
              onChange={(e) => setField("placa", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de unidad</Label>
              <select
                className={inputBase}
                value={form.tipoUnidad}
                onChange={(e) => setField("tipoUnidad", e.target.value)}
              >
                <option>Apartamento</option>
                <option>Casa</option>
                <option>Oficina</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Número</Label>
              <input
                className={inputBase}
                placeholder="101-A"
                value={form.numeroUnidad}
                onChange={(e) => setField("numeroUnidad", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tipo novedad */}
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

        {/* Observaciones */}
        <div className="space-y-3">
          <SectionTitle icon="📝" title="Observaciones Generales" />

          <div className="text-xs font-extrabold tracking-widest text-blue-700 uppercase">
            Registro automático: {formatFull(new Date().toISOString())}
          </div>

          <textarea
            className={`${inputBase} min-h-[140px]`}
            placeholder="Describa los detalles..."
            value={form.observaciones}
            onChange={(e) => setField("observaciones", e.target.value)}
          />
        </div>

        {/* Evidencia */}
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
                  onClick={() => removePhotoAt(idx)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botón flotante limpio */}
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
