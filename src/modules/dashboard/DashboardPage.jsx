import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Users,
  Shield,
  Bell,
  Package,
  AlertTriangle,
  FileText,
  Wrench,
  BarChart3,
} from "lucide-react";

const SectionTitle = ({ icon, title, right }) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        {title}
      </h2>
    </div>
    {right}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const KpiCard = ({ icon, value, label, color }) => {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    yellow: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <Card className="p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${colorStyles[color]}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 text-3xl font-bold text-slate-900 leading-none">
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </div>
    </Card>
  );
};

export default function DashboardPage() {
  const kpis = useMemo(
    () => ({
      vehiculosHoy: 12,
      visitantes: 8,
      personalActivo: 5,
      paquetes: 14,
      emergencias: 1,
      novedades: 3,
    }),
    []
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Panel Principal
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Resumen operativo del edificio
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition flex items-center justify-center"
              aria-label="Notificaciones"
            >
              <Bell size={18} />
            </button>

            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
              JG
            </div>
          </div>
        </div>

        {/* Card principal */}
        <Card className="p-6">
          <SectionTitle
            icon={<Shield size={18} />}
            title="Gestión de personal"
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-slate-600">
                Registrar ingreso y salida del personal operativo.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Todo queda asociado al ID de condominio con fecha y hora automática.
              </p>
            </div>

            <Link
              to="/control-ingreso"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition text-center"
            >
              Registrar ingreso
            </Link>
          </div>
        </Card>

        {/* KPIs */}
        <div className="mt-8">
          <SectionTitle
            icon={<BarChart3 size={18} />}
            title="Indicadores rápidos"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              icon={<Car size={20} />}
              value={kpis.vehiculosHoy}
              label="Vehículos hoy"
              color="blue"
            />

            <KpiCard
              icon={<Users size={20} />}
              value={kpis.visitantes}
              label="Visitantes"
              color="green"
            />

            <KpiCard
              icon={<Wrench size={20} />}
              value={kpis.personalActivo}
              label="Personal activo"
              color="purple"
            />

            <KpiCard
              icon={<Package size={20} />}
              value={kpis.paquetes}
              label="Paquetes"
              color="yellow"
            />

            <KpiCard
              icon={<AlertTriangle size={20} />}
              value={kpis.emergencias}
              label="Emergencias"
              color="red"
            />

            <KpiCard
              icon={<FileText size={20} />}
              value={kpis.novedades}
              label="Novedades"
              color="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}