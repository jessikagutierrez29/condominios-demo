import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../service/user.service";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getUser(id);
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-slate-500">Cargando usuario...</div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 space-y-4">
        <Header
          title="Detalle de Usuario"
          subtitle={`ID: ${id}`}
          onBack={() => navigate("/ajustes/usuarios")}
        />

        <div className="app-card p-5">
          <p className="text-sm text-slate-700">
            No se encontró el usuario con ID <b>{id}</b>.
          </p>

          <button
            onClick={() => navigate("/ajustes/usuarios")}
            className="mt-4 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const roleName = user.roles?.[0]?.name ?? "Sin rol";

  return (
    <div className="w-full">
      <div className="p-6 space-y-5 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-500">
            Ajustes <span className="mx-2">/</span>
            <button
              onClick={() => navigate("/ajustes/usuarios")}
              className="hover:text-slate-700"
            >
              Usuarios
            </button>
            <span className="mx-2">/</span>
            <span className="text-slate-700 font-medium">
              {user.full_name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
              👤
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user.full_name}
              </h1>
              <p className="text-sm text-slate-500">
                Documento: {user.document_number}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/ajustes/usuarios")}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          >
            Volver
          </button>

          <button
            onClick={() =>
              navigate(`/ajustes/usuarios/${user.id}/editar`)
            }
            className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
          >
            Editar
          </button>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="app-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Resumen
          </h2>

          <StatusPill active={user.is_active} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Info label="Correo" value={user.email} />
          <Info label="Teléfono" value={user.phone} />
          <Info label="Fecha nacimiento" value={user.birth_date} />
          <Info label="Rol" value={roleName} />
        </div>
      </div>

      {/* PERFIL ASOCIADO */}
      <div className="app-card p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Perfil Asociado
        </h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Info
            label="Tipo de perfil"
            value={
              user.resident
                ? "Residente"
                : user.operative
                ? "Operativo"
                : "N/A"
            }
          />

          <Info
            label="Estado del perfil"
            value={
              user.resident?.is_active || user.operative?.is_active
                ? "Activo"
                : "Inactivo"
            }
          />
        </div>
      </div>

      {/* ZONA DE RIESGO */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-semibold text-amber-900">
          Acciones avanzadas
        </h3>

        <p className="text-sm text-amber-800 mt-1">
          Desactivar usuario requerirá confirmación y registro en log.
        </p>

        <button
          onClick={() => alert("Desactivar (pendiente)")}
          className="mt-4 px-4 py-2 rounded-xl bg-amber-900 text-white hover:opacity-90"
        >
          Desactivar usuario
        </button>
      </div>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Header({ title, subtitle, onBack }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <button
        onClick={onBack}
        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
      >
        Volver
      </button>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900 mt-1">
        {value ?? "-"}
      </div>
    </div>
  );
}

function StatusPill({ active }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm border ${
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-red-50 text-red-700 border-red-100"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}
