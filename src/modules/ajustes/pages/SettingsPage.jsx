import { useNavigate } from "react-router-dom";
import {
  Settings,
  Building,
  Building2,
  Shield,
  ChevronRight,
  User,
  Car,
  Download
} from "lucide-react";

function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function PageTitle({ eyebrow, title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 max-w-[52ch]">{subtitle}</p>
        )}
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function ItemRow({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left",
        "rounded-2xl border border-slate-200 bg-white px-4 py-4",
        "shadow-sm transition active:scale-[0.99] hover:bg-slate-50",
        "flex items-center justify-between gap-4",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-11 w-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900 truncate">
            {title}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500 truncate">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight size={18} className="text-slate-400 shrink-0" />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6">
        {/* Header */}
        <PageTitle
          eyebrow="Configuración"
          title="Ajustes"
          subtitle="Administra la parametrización del condominio: unidades, apartamentos, usuarios y tipos de vehículos."
          right={
            <button
              type="button"
              className="h-11 w-11 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50 transition flex items-center justify-center"
              aria-label="Preferencias"
            >
              <Settings size={20} />
            </button>
          }
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Columna izquierda */}
          <div className="lg:col-span-8 space-y-5">
            <Card>
              <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                1. Gestión del sistema
              </p>

              <div className="mt-4 space-y-3">
                <ItemRow
                  icon={<Building size={18} />}
                  title="Unidades"
                  description="Gestiona las unidades que maneja tu condominio"
                  onClick={() => navigate("/ajustes/unidades")}
                />

                <ItemRow
                  icon={<Building2 size={18} />}
                  title="Apartamentos"
                  description="Gestiona los apartamentos de tus unidades"
                  onClick={() => navigate("/ajustes/apartamentos")}
                />

                <ItemRow
                  icon={<User size={18} />}
                  title="Usuarios"
                  description="Gestiona los usuarios del sistema"
                  onClick={() => navigate("/ajustes/usuarios")}
                />

                <ItemRow
                  icon={<Car size={18} />}
                  title="Tipos de vehículos"
                  description="Gestiona los tipos de vehículos del sistema"
                  onClick={() => navigate("/ajustes/tipos-vehiculos")}
                />
              </div>
            </Card>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-4 space-y-5">
            {/* Card Rol */}
            <Card>
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Shield size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                    Rol restringido
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    Administrador de Condominios
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Acceso a parametrización y mantenimiento del sistema.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-extrabold text-slate-700">
                  Recomendación
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Mantén la parametrización por ID de condominio y evita editar
                  estados manualmente.
                </p>
              </div>
            </Card>

            {/* ✅ NUEVO BOTÓN DESCARGAR MINUTA */}
            <Card>
              <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
                Descargas
              </p>

              <a
                href="https://organizaciongen1-my.sharepoint.com/:x:/r/personal/desarrollador_junior2_organizaciongen_com/_layouts/15/Doc.aspx?sourcedoc=%7B60FD466A-936F-46AD-9A9C-74E3D66E60FD%7D&file=Minuta_Digital_Modular_Simulada.xlsx&action=default&mobileredirect=true"
                target="_blank"
                rel="noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] transition shadow-sm"
              >
                <Download size={18} />
                Descargar minuta
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}