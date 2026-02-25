import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SearchField from "../../components/SearchField";
import Card from "../../components/Card";
import Pill from "../../components/Pill";
import BottomCTA from "../../components/BottomCTA";
import { fetchUsers } from "../service/user.service";

export default function UsersPage() {
  const navigate = useNavigate();

  const condominiumId = 1; // 🔥 luego lo sacamos del contexto global

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchUsers(condominiumId);
        setUsers(res.data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [condominiumId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return users.filter((u) => {
      if (!query) return true;

      return (
        u.full_name?.toLowerCase().includes(query) ||
        u.document_number?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
      );
    });
  }, [users, q]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-4xl mx-auto">

        <PageHeader
          title="Usuarios"
          showBack
        />

        <div className="mt-2">
          <SearchField
            value={q}
            onChange={setQ}
            placeholder="Buscar por nombre, documento o correo..."
          />
        </div>

        <div className="px-5 mt-6 space-y-4 pb-32">

          {loading && (
            <div className="text-slate-500">Cargando usuarios...</div>
          )}

          {!loading && filtered.map((u) => {

            const roleName = u.roles?.[0]?.name ?? "Sin rol";

            return (
              <Card
                key={u.id}
                className="p-4 flex items-center justify-between"
                onClick={() => navigate(`/ajustes/usuarios/${u.id}`)}
              >
                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                    👤
                  </div>

                  <div>
                    <p className="text-lg font-extrabold text-slate-900">
                      {u.full_name}
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      {u.document_number}
                    </p>

                    <div className="mt-2">
                      <Pill variant="neutral">
                        {roleName}
                      </Pill>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Pill
                    variant={u.is_active ? "success" : "danger"}
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </Pill>

                  <div className="text-slate-300 text-2xl">›</div>
                </div>
              </Card>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-slate-500">
              No se encontraron usuarios.
            </div>
          )}

        </div>
      </div>

      <BottomCTA
        label="Registrar usuario"
        onClick={() => navigate("/ajustes/usuarios/crear")}
      />
    </div>
  );
}
