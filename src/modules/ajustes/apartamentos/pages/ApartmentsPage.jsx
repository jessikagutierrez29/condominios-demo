import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SearchField from "../../components/SearchField";
import ChipSelect from "../../components/ChipSelect";
import Card from "../../components/Card";
import Pill from "../../components/Pill";
import BottomCTA from "../../components/BottomCTA";
import { useApartments } from "../hooks/useApartments";

const statusToPill = (status) => {
  if (status === "ocupado") return { variant: "success", label: "Ocupado" };
  if (status === "disponible") return { variant: "warning", label: "Disponible" };
  if (status === "mantenimiento") return { variant: "neutral", label: "Mantenimiento" };
  return { variant: "neutral", label: status };
};

// 🔎 Derivar estado dinámicamente desde backend
const getApartmentStatus = (a) => {
  if (!a.is_active) return "mantenimiento";
  if (a.residents && a.residents.length > 0) return "ocupado";
  return "disponible";
};

export default function ApartmentsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const condominiumId = 1; // 🔐 luego lo sacamos del auth context

  const { apartments, loading } = useApartments(condominiumId);

  const [q, setQ] = useState("");
  const [tower, setTower] = useState("Todas");
  const [floor, setFloor] = useState("Todos");
  const [status, setStatus] = useState("Todos");

  // Toast de creación
  const created = params.get("created") === "1";

  // 🔹 Torres dinámicas
  const towers = useMemo(() => {
    const set = new Set(apartments.map((a) => a.tower).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [apartments]);

  // 🔹 Pisos dinámicos
  const floors = useMemo(() => {
    const set = new Set(apartments.map((a) => a.floor).filter((f) => f !== null));
    const sorted = Array.from(set).sort((a, b) => a - b);
    return ["Todos", ...sorted.map(String)];
  }, [apartments]);

  const statuses = ["Todos", "ocupado", "disponible", "mantenimiento"];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return apartments.filter((a) => {
      const statusValue = getApartmentStatus(a);
      const name = `Apto ${a.number}`;

      const matchesQ =
        !query ||
        `${name} ${a.tower} ${a.floor} ${a.unitType?.name} ${statusValue}`
          .toLowerCase()
          .includes(query);

      const matchesTower = tower === "Todas" || a.tower === tower;
      const matchesFloor = floor === "Todos" || String(a.floor) === String(floor);
      const matchesStatus = status === "Todos" || statusValue === status;

      return matchesQ && matchesTower && matchesFloor && matchesStatus;
    });
  }, [q, tower, floor, status, apartments]);

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto">

        <PageHeader
          title="Apartamentos"
          showBack
          rightSlot={
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-slate-100 text-slate-700 font-bold"
              onClick={() => alert("Menú (pendiente)")}
              aria-label="Más opciones"
            >
              …
            </button>
          }
        />

        {created && (
          <div className="px-5 mt-2">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-semibold flex items-center justify-between gap-3">
              <span>✅ Apartamento registrado correctamente</span>
              <button
                type="button"
                onClick={() => {
                  setParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete("created");
                    return next;
                  }, { replace: true });
                }}
                className="text-xs font-bold text-emerald-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <div className="mt-2">
          <SearchField
            value={q}
            onChange={setQ}
            placeholder="Buscar por apto, torre..."
          />
        </div>

        <div className="px-5 mt-4 flex gap-3 flex-wrap">
          <ChipSelect
            label="Torres"
            valueLabel={tower === "Todas" ? "Todas las torres" : tower}
            active={tower !== "Todas"}
            options={towers.map((t) => ({
              value: t,
              label: t === "Todas" ? "Todas las torres" : t,
              active: t === tower,
            }))}
            onSelect={setTower}
          />

          <ChipSelect
            label="Piso"
            valueLabel={floor === "Todos" ? "Piso" : `Piso ${floor}`}
            active={floor !== "Todos"}
            options={floors.map((f) => ({
              value: f,
              label: f === "Todos" ? "Todos" : `Piso ${f}`,
              active: String(f) === String(floor),
            }))}
            onSelect={setFloor}
          />

          <ChipSelect
            label="Estado"
            valueLabel={status === "Todos" ? "Estado" : statusToPill(status).label}
            active={status !== "Todos"}
            options={statuses.map((s) => ({
              value: s,
              label: s === "Todos" ? "Todos" : statusToPill(s).label,
              active: s === status,
            }))}
            onSelect={setStatus}
            align="right"
          />
        </div>

        <div className="px-5 mt-6 space-y-4 pb-32">

          {loading && (
            <div className="text-center text-slate-400">
              Cargando apartamentos...
            </div>
          )}

          {!loading && filtered.map((a) => {
            const statusValue = getApartmentStatus(a);
            const pill = statusToPill(statusValue);
            const name = `Apto ${a.number}`;

            return (
              <Card
                key={a.id}
                className="p-4 flex items-center justify-between"
                onClick={() => navigate(`/ajustes/apartamentos/${a.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">
                    🏢
                  </div>

                  <div>
                    <p className="text-xl font-extrabold text-slate-900">{name}</p>
                    <p className="text-slate-500 mt-1">
                      {a.tower || "Sin torre"} • Piso {a.floor ?? "-"}
                    </p>

                    <div className="mt-2">
                      <Pill variant="neutral">
                        {a.unit_type?.name || "Sin tipo"}
                      </Pill>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Pill variant={pill.variant}>{pill.label}</Pill>
                  <div className="text-slate-300 text-2xl">›</div>
                </div>
              </Card>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div className="app-card p-6 text-center text-slate-500">
              No se encontraron apartamentos con esos filtros.
            </div>
          )}
        </div>
      </div>

      <BottomCTA
        label="Registrar apartamento"
        onClick={() => navigate("/ajustes/apartamentos/crear")}
      />
    </div>
  );
}
