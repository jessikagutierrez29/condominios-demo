import { useNavigate } from "react-router-dom";
import { Boxes } from "lucide-react";

export default function InventoryMaintenancePage() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="app-card p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Boxes size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Módulo en desarrollo
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Disponible próximamente
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="app-button-primary opacity-60 cursor-not-allowed w-full lg:w-auto"
            >
              Próximamente
            </button>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="app-button-secondary w-full lg:w-auto"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
