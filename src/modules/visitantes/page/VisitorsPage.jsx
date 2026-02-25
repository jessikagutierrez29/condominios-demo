import VisitorForm from "../components/VisitorForm";
import VisitorsList from "../components/VisitorList";
import { useVisitors } from "../hooks/visitors";
import { Users, UserPlus, Activity } from "lucide-react";

export default function VisitorsPage() {
  const condominiumId = 1;

  const { apartments, visits, loading, registerVisit, checkout } =
    useVisitors(condominiumId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto w-full max-w-7xl px-8 py-10 space-y-10">

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

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Registro de Visitantes
          </h1>

          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Controla ingresos en tiempo real, registra evidencia fotográfica y
            administra salidas de manera segura.
          </p>
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Activity size={18} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Visitantes en Tiempo Real
              </h2>
            </div>

            <VisitorsList
              visits={visits}
              onCheckout={checkout}
            />
          </div>

        </div>
      </div>
    </div>
  );
}