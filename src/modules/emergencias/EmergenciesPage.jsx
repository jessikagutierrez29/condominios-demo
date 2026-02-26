import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Siren,
  Shield,
  Flame,
  Ambulance,
  Zap,
  Droplets,
  Clock,
} from "lucide-react";

const inputBase = "app-input";

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
      {icon}
    </div>
    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
  </div>
);

const EmergencyContactCard = ({ icon, bgColor, iconColor, title, subtitle }) => (
  <div className="app-card p-5 flex items-start gap-4 hover:shadow-md transition">
    <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <div className="text-xs font-bold tracking-widest text-slate-500 uppercase">
        {title}
      </div>
      <div className="text-base font-extrabold text-slate-900">
        {subtitle}
      </div>
    </div>
  </div>
);

const formatNow = () => {
  const d = new Date();
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date}, ${time} (Automático)`;
};

export default function EmergenciesPage() {
  const [form, setForm] = useState({
    tipo: "",
    lugar: "",
    descripcion: "",
    createdAt: new Date().toISOString(),
  });

  const setField = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tipo || !form.lugar || !form.descripcion.trim()) return;

    console.log("Emergencia reportada:", form);

    setForm({
      tipo: "",
      lugar: "",
      descripcion: "",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 pt-4 pb-3 flex items-center gap-3 max-w-3xl mx-auto">
          <button
            type="button"
            className="w-10 h-10 rounded-2xl hover:bg-slate-100 flex items-center justify-center"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} className="text-slate-600" />
          </button>

          <h1 className="text-xl font-extrabold text-slate-900">
            Gestión de Emergencias y Salud
          </h1>
        </div>
      </div>

      <div className="px-4 max-w-3xl mx-auto space-y-6 pb-[140px]">

        {/* ALERTA */}
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mt-6 flex items-start gap-3">
          <AlertTriangle size={20} />
          <div className="text-sm font-medium">
            Use este formulario solo para reportar incidentes críticos que requieren atención inmediata.
          </div>
        </div>

        {/* FORMULARIO */}
        <form
          id="emergencyForm"
          onSubmit={handleSubmit}
          className="app-card p-6 space-y-6"
        >
          <SectionTitle
            icon={<Siren size={18} />}
            title="Reportar Incidente"
          />

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Tipo de Emergencia
            </label>
            <select
              className={inputBase}
              value={form.tipo}
              onChange={(e) => setField("tipo", e.target.value)}
            >
              <option value="">Seleccione tipo...</option>
              <option>Incendio</option>
              <option>Accidente</option>
              <option>Emergencia Médica</option>
              <option>Fuga de Gas</option>
              <option>Falla Eléctrica</option>
              <option>Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Lugar del Evento
            </label>
            <select
              className={inputBase}
              value={form.lugar}
              onChange={(e) => setField("lugar", e.target.value)}
            >
              <option value="">Seleccione ubicación...</option>
              <option>Lobby</option>
              <option>Parqueadero</option>
              <option>Piscina</option>
              <option>Gimnasio</option>
              <option>Apartamento</option>
              <option>Zona Común</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Descripción
            </label>
            <textarea
              className={`${inputBase} min-h-[120px]`}
              placeholder="Detalles del incidente..."
              value={form.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
            <Clock size={16} />
            {formatNow()}
          </div>
        </form>

        {/* CONTACTOS */}
        <div className="pt-6 space-y-4">
          <div className="text-sm font-extrabold tracking-widest text-slate-600 uppercase">
            Contactos de Emergencia
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <EmergencyContactCard
              icon={<Shield size={20} />}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
              title="Policía"
              subtitle="Cuadrante Zona"
            />

            <EmergencyContactCard
              icon={<Flame size={20} />}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
              title="Bomberos"
              subtitle="Línea Directa"
            />

            <EmergencyContactCard
              icon={<Ambulance size={20} />}
              bgColor="bg-red-50"
              iconColor="text-red-600"
              title="Ambulancia"
              subtitle="Urgencias"
            />

            <EmergencyContactCard
              icon={<Flame size={20} />}
              bgColor="bg-amber-50"
              iconColor="text-amber-600"
              title="Gas"
              subtitle="Emergencias Gas"
            />

            <EmergencyContactCard
              icon={<Zap size={20} />}
              bgColor="bg-yellow-50"
              iconColor="text-yellow-600"
              title="Energía"
              subtitle="Fallas Eléctricas"
            />

            <EmergencyContactCard
              icon={<Droplets size={20} />}
              bgColor="bg-cyan-50"
              iconColor="text-cyan-600"
              title="Acueducto"
              subtitle="Daños de Agua"
            />

          </div>
        </div>
      </div>

      {/* BOTÓN FLOTANTE AZUL */}
      <div className="fixed left-0 right-0 bottom-6 z-50 pointer-events-none">
        <div className="max-w-3xl mx-auto px-4 pointer-events-auto">
          <button
            type="submit"
            form="emergencyForm"
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-extrabold shadow-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <AlertTriangle size={18} className="text-yellow-300" />
            Reportar Emergencia
          </button>
        </div>
      </div>
    </div>
  );
}
