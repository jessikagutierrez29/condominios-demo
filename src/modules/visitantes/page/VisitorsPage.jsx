import { useNavigate } from "react-router-dom";
import VisitorForm from "../components/VisitorForm";
import VisitorsList from "../components/VisitorList";
import { useVisitors } from "../hooks/visitors";
import { Users, UserPlus, Activity } from "lucide-react";

export default function VisitorsPage() {
  const navigate = useNavigate();
  const condominiumId = 1;

  const { apartments, visits, loading, registerVisit, checkout } =
    useVisitors(condominiumId);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="app-button-secondary px-4 py-2 text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Gestión de accesos
            </p>
          </div>

          <h1 className="mt-3 app-title">Registro de Visitantes</h1>

          <p className="mt-2 app-subtitle max-w-xl">
            Controla ingresos en tiempo real, registra evidencia fotográfica y
            administra salidas de manera segura.
          </p>
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="app-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus size={18} className="text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Nuevo Ingreso
              </h2>
            </div>

            <VisitorForm
              apartments={apartments}
              onSubmit={registerVisit}
              loading={loading}
            />
          </div>

          {/* LISTA */}
          <div className="app-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity size={18} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Visitantes en Tiempo Real
              </h2>
            </div>

            <VisitorsList visits={visits} onCheckout={checkout} />
          </div>
        </div>
      </div>
    </div>
  );
}
