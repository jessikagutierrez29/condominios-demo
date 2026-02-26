import { useMemo, useRef, useState } from "react";
import { MapPin, Camera } from "lucide-react";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const mockEmployees = [
  {
    id: 99281,
    fullName: "Juan Alberto Pérez García",
    role: "Mantenimiento",
    tower: "Torre A",
    area: "Servicios Generales",
    type: "INTERNO",
    avatar: "https://i.pravatar.cc/140?img=12",
    observations: "Sin novedades en el turno anterior. Reporta ingreso puntual.",
  },
  {
    id: 88412,
    fullName: "María Santos",
    role: "Recepción",
    tower: "Torre A",
    area: "Área Social",
    type: "INTERNO",
    avatar: "https://i.pravatar.cc/140?img=47",
    observations: "Ingreso programado.",
  },
];

const Card = ({ children, className = "" }) => (
  <div className={`app-card ${className}`}>{children}</div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div>
    <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
      {subtitle}
    </p>
    <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
  </div>
);

function Segmented({ value, onChange }) {
  const items = [
    { key: "todos", label: "TODOS" },
    { key: "internos", label: "INTERNOS" },
    { key: "contratistas", label: "CONTRATISTAS" },
  ];

  return (
    <div className="rounded-2xl bg-slate-100 p-2">
      <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-semibold">
        {items.map((it) => {
          const active = value === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "rounded-xl py-2 transition",
                active
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-white/60",
              ].join(" ")}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RowItem({ name, role, place, time }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-slate-100" />
        <div>
          <p className="text-sm font-extrabold text-slate-900">{name}</p>
          <p className="text-[11px] font-semibold text-slate-500">
            {role} • {place}
          </p>
        </div>
      </div>
      <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
        {time}
      </span>
    </div>
  );
}

export default function ControlIngresoPage() {
  const [selectedId, setSelectedId] = useState(mockEmployees[0].id);
  const [activeList, setActiveList] = useState([
    {
      id: 99281,
      fullName: "Juan Pérez",
      role: "Mantenimiento",
      place: "Torre A",
      time: "07:58 AM",
    },
    {
      id: 88412,
      fullName: "María Santos",
      role: "Recepción",
      place: "Área Social",
      time: "08:15 AM",
    },
  ]);
  const [historyList, setHistoryList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("turno");
  const [segment, setSegment] = useState("todos");

  const fileRef = useRef(null);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceName, setEvidenceName] = useState("");

  const employee = useMemo(
    () => mockEmployees.find((e) => e.id === selectedId),
    [selectedId]
  );

  const badge = employee?.type ?? "INTERNO";
  const isPresent = activeList.some((p) => p.id === selectedId);
  const hasEvidence = Boolean(evidenceUrl);

  function resetEvidence() {
    setEvidenceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setEvidenceName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function fakeSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 450));
    setSaving(false);
  }

  async function handleIngreso() {
    if (saving) return;
    if (!hasEvidence && !DEMO_MODE) return;
    await fakeSave();
    if (!employee) return;
    setActiveList((prev) => {
      if (prev.some((p) => p.id === employee.id)) return prev;
      const time = new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return [
        {
          id: employee.id,
          fullName: employee.fullName,
          role: employee.role,
          place: employee.area,
          time,
        },
        ...prev,
      ];
    });
  }

  async function handleSalida() {
    if (saving) return;
    if (!hasEvidence && !DEMO_MODE) return;
    await fakeSave();
    if (!employee) return;
    const time = new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setActiveList((prev) => prev.filter((p) => p.id !== employee.id));
    setHistoryList((prev) => [
      {
        id: employee.id,
        fullName: employee.fullName,
        role: employee.role,
        place: employee.area,
        time,
      },
      ...prev,
    ]);
  }

  function openPicker() {
    fileRef.current?.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      alert("Por favor selecciona una imagen.");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setEvidenceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setEvidenceName(file.name);
  }

  function clearEvidence() {
    setEvidenceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setEvidenceName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const canRegister = DEMO_MODE ? true : hasEvidence;

  const ctaHint = !canRegister
    ? "Primero toma o carga la evidencia fotográfica."
    : isPresent
      ? "Listo para registrar la salida."
      : "Listo para registrar el ingreso.";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="app-button-secondary px-4 py-2 text-sm"
          >
            ← Volver
          </button>
        </div>

        <div className="mb-6">
          <SectionTitle subtitle="Gestión de personal" title="Control de Ingreso" />
          <p className="mt-2 text-sm text-slate-500">{ctaHint}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Segmented value={segment} onChange={setSegment} />

            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                Seleccionar empleado
              </p>

              <Card className="p-3">
                <div className="flex items-center gap-3">
                  <select
                    className="w-full appearance-none bg-transparent text-sm font-bold text-slate-900 outline-none"
                    value={selectedId}
                    onChange={(e) => {
                      resetEvidence();
                      setSelectedId(Number(e.target.value));
                    }}
                  >
                    {mockEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fullName}
                      </option>
                    ))}
                  </select>
                  <div className="text-slate-400">▾</div>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {employee?.role} • {employee?.tower}
                </p>
              </Card>
            </div>

            <Card className="p-4 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                  <img
                    src={employee?.avatar}
                    alt={employee?.fullName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                      {badge}
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      ID: {employee?.id}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-extrabold text-slate-900 leading-tight">
                    {employee?.fullName}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    {employee?.role}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <MapPin size={14} className="text-blue-500" />
                    <span>
                      {employee?.tower?.toUpperCase()} - {employee?.area?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="my-4 h-px bg-slate-100" />

              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Observaciones
              </p>
              <p className="mt-2 text-sm italic text-slate-700">
                “{employee?.observations}”
              </p>

              <div className="mt-4">
                <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                  Evidencia
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                />

                {hasEvidence ? (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={evidenceUrl}
                      alt="Evidencia"
                      className="w-full h-[220px] object-cover"
                    />
                    <div className="p-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-600 truncate">{evidenceName}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={openPicker}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={clearEvidence}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openPicker}
                    className="mt-3 w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center hover:bg-slate-100 transition"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200">
                      <Camera size={20} className="text-slate-600" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">
                      Tomar / Cargar fotografía
                    </p>
                    <p className="mt-1 max-w-[360px] text-xs font-semibold text-slate-500">
                      Para la demo puedes cargar una imagen desde tu computador
                    </p>
                  </button>
                )}

                {!hasEvidence && (
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    La evidencia es obligatoria antes de registrar.
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Estado
                </span>
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-extrabold",
                    isPresent
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700",
                  ].join(" ")}
                >
                  {isPresent ? "PRESENTE" : "FUERA"}
                </span>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-4 rounded-3xl">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                Registro
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={handleIngreso}
                  disabled={saving || !canRegister}
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-extrabold transition",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    isPresent
                      ? "border-slate-200 bg-slate-50 text-slate-400"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                  ].join(" ")}
                >
                  {saving && !isPresent ? "GUARDANDO..." : "REGISTRAR INGRESO"}
                </button>

                <button
                  onClick={handleSalida}
                  disabled={saving || !canRegister}
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-extrabold transition",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    !isPresent
                      ? "border-slate-200 bg-slate-50 text-slate-400"
                      : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                  ].join(" ")}
                >
                  {saving && isPresent ? "GUARDANDO..." : "REGISTRAR SALIDA"}
                </button>
              </div>

              {!canRegister && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-bold text-amber-900">Falta evidencia</p>
                  <p className="mt-1 text-xs font-semibold text-amber-800">
                    Debes tomar o cargar la foto para habilitar el registro.
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-3 rounded-3xl">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-2">
                <button
                  onClick={() => setActiveTab("turno")}
                  className={[
                    "rounded-xl py-2 text-xs font-extrabold tracking-wide uppercase transition",
                    activeTab === "turno"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500 hover:bg-white/60",
                  ].join(" ")}
                >
                  Personal en turno{" "}
                  <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700">
                    {activeList.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("historial")}
                  className={[
                    "rounded-xl py-2 text-xs font-extrabold tracking-wide uppercase transition",
                    activeTab === "historial"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-500 hover:bg-white/60",
                  ].join(" ")}
                >
                  Historial salidas
                </button>
              </div>

              <div className="mt-3">
                {activeTab === "turno" ? (
                  <div className="space-y-3 p-2">
                    {activeList.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No hay personal en turno.
                      </div>
                    ) : (
                      activeList.map((p) => (
                        <RowItem
                          key={p.id}
                          name={p.fullName}
                          role={p.role}
                          place={p.place}
                          time={p.time}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="p-2 space-y-3">
                    {historyList.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No hay salidas registradas.
                      </div>
                    ) : (
                      historyList.map((p, idx) => (
                        <RowItem
                          key={`${p.id}-${idx}`}
                          name={p.fullName}
                          role={p.role}
                          place={p.place}
                          time={p.time}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="mt-2 w-full rounded-2xl px-4 py-3 text-left text-xs font-extrabold tracking-wide text-slate-500 uppercase hover:bg-slate-50 transition"
              >
                Ver resumen completo de asistencia →
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
