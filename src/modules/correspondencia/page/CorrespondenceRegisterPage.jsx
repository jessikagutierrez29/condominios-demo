import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  demoCreateCorrespondence,
  demoDeliverCorrespondence,
  demoFetchCorrespondences,
  demoFetchApartments,
} from "../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const Card = ({ children, className = "" }) => (
  <div className={["app-card p-6", className].join(" ")}>{children}</div>
);

const Kicker = ({ children }) => (
  <p className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
    {children}
  </p>
);

const Title = ({ children }) => (
  <h1 className="mt-2 text-2xl font-extrabold text-slate-900 leading-tight">
    {children}
  </h1>
);

const Subtitle = ({ children }) => (
  <p className="mt-2 text-sm font-semibold text-slate-500">{children}</p>
);

const SectionTitle = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-extrabold text-slate-900">{title}</p>
      {desc ? <p className="mt-1 text-xs font-semibold text-slate-500">{desc}</p> : null}
    </div>
  </div>
);

const Label = ({ children }) => (
  <p className="text-sm font-semibold text-slate-700">{children}</p>
);

const Hint = ({ children }) => (
  <p className="text-xs font-semibold text-slate-400">{children}</p>
);

const inputBase = "mt-2 app-input";

const textareaBase = "mt-2 app-input min-h-[110px] py-3";

const PrimaryButton = ({ children, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    className="app-button-primary w-full py-4 text-sm font-extrabold shadow-xl"
  >
    {children}
  </button>
);

const GhostButton = ({ children, ...props }) => (
  <button
    {...props}
    className="text-xs font-extrabold text-rose-700 hover:text-rose-800"
    type="button"
  >
    {children}
  </button>
);

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-sm font-extrabold text-slate-900">{text}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        Cuando registres entregas, aparecerán aquí para consulta rápida.
      </p>
    </div>
  );
}

function Row({ item, onDeliver }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-slate-900">
          {item?.courier || "Mensajería"} • {item?.unit_label || "Unidad"}
        </p>
        <p className="truncate text-[11px] font-semibold text-slate-500">
          {item?.type || "Documento"} • Recibe: {item?.receiver || "—"}
        </p>
        <p className="truncate text-[11px] font-semibold text-slate-400">
          {item?.created_at
            ? new Date(item.created_at).toLocaleString("es-CO")
            : "—"}
        </p>
      </div>

      {item.status === "pending" ? (
        <button
          type="button"
          onClick={() => onDeliver?.(item.id)}
          className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
        >
          Marcar entregado
        </button>
      ) : (
        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-700 border border-slate-200">
          Entregado
        </span>
      )}
    </div>
  );
}

export default function CorrespondencePage() {
  const navigate = useNavigate();
  const condominiumId = 1;

  const [apartments, setApartments] = useState([]);
  const couriers = ["Servientrega", "Interrapidísimo", "Coordinadora"];

  const [form, setForm] = useState({
    courier: "Servientrega",
    unitId: "",
    packageType: "documento",
    receiverName: "",
    notes: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");
  const [list, setList] = useState([]);
  const [tab, setTab] = useState("pending");
  const fileRef = useRef(null);

  const canSubmit =
    form.courier &&
    form.unitId &&
    form.packageType &&
    form.receiverName.trim().length > 0;

  useEffect(() => {
    if (!DEMO_MODE) return;
    demoFetchCorrespondences(condominiumId).then((res) => setList(res.data || []));
    demoFetchApartments(condominiumId).then((res) => {
      const mapped =
        res.data?.map((a) => ({
          id: a.id,
          label: `Apto ${a.number}`,
        })) || [];
      setApartments(mapped);
    });
  }, [condominiumId]);

  const onPickPhoto = (file) => {
    if (!file) {
      setPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const clearPhoto = () => {
    setPhotoPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const unitLabel = apartments.find((a) => String(a.id) === form.unitId)?.label;
    const typeLabel = form.packageType === "paquete" ? "Paquete" : "Documento";

    if (DEMO_MODE) {
      const res = await demoCreateCorrespondence({
        condominium_id: condominiumId,
        courier: form.courier,
        unit_label: unitLabel,
        type: typeLabel,
        receiver: form.receiverName.trim(),
        notes: form.notes.trim(),
        status: "pending",
      });
      setList((prev) => [res.data, ...prev]);
    }

    setForm({
      courier: "Servientrega",
      unitId: "",
      packageType: "documento",
      receiverName: "",
      notes: "",
    });
    clearPhoto();
    setTab("pending");
  };

  const handleDeliver = async (id) => {
    if (!DEMO_MODE) return;
    await demoDeliverCorrespondence(id);
    const res = await demoFetchCorrespondences(condominiumId);
    setList(res.data || []);
    setTab("delivered");
  };

  const pending = list.filter((l) => l.status === "pending");
  const delivered = list.filter((l) => l.status === "delivered");

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="app-button-secondary px-4 py-2 text-sm"
          >
            ← Volver
          </button>
        </div>

        <div className="mb-6 mt-4">
          <Kicker>Gestión de accesos</Kicker>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Title>Registro de Correspondencia</Title>
              <Subtitle>
                Registra la entrega con evidencia, datos del destinatario y firma.
              </Subtitle>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card>
            <SectionTitle
              icon="📮"
              title="Nueva correspondencia"
              desc="Captura evidencia, selecciona destino y registra la entrega."
            />

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Empresa de mensajería</Label>
                  <select
                    name="courier"
                    value={form.courier}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    {couriers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Unidad destino</Label>
                  <select
                    name="unitId"
                    value={form.unitId}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">Seleccione unidad</option>
                    {apartments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Tipo de paquete</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, packageType: "documento" }))}
                    className={[
                      "rounded-2xl border px-4 py-4 text-sm font-extrabold transition",
                      form.packageType === "documento"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    📄 Documento
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, packageType: "paquete" }))}
                    className={[
                      "rounded-2xl border px-4 py-4 text-sm font-extrabold transition",
                      form.packageType === "paquete"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    📦 Paquete
                  </button>
                </div>
              </div>

              <div>
                <Label>Evidencia fotográfica</Label>
                <Hint>Para la demo puedes cargar una imagen desde tu computador.</Hint>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickPhoto(e.target.files?.[0])}
                />

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center hover:bg-slate-100 transition"
                >
                  {photoPreview ? (
                    <div className="space-y-3">
                      <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={photoPreview}
                          alt="Evidencia"
                          className="h-48 w-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-extrabold text-slate-700">
                        Cambiar fotografía
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        📷
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        Tomar / Cargar fotografía
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        Toque aquí para activar cámara o cargar imagen
                      </p>
                    </div>
                  )}
                </button>

                {photoPreview && (
                  <div className="mt-2 flex justify-end">
                    <GhostButton onClick={clearPhoto}>Quitar foto</GhostButton>
                  </div>
                )}
              </div>

              <div>
                <SectionTitle icon="✍️" title="Datos de entrega" />
                <div className="mt-4">
                  <Label>Nombre del destinatario</Label>
                  <input
                    name="receiverName"
                    value={form.receiverName}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    className={inputBase}
                  />
                </div>

                <div className="mt-4">
                  <Label>Firma de quien recibe</Label>
                  <div className="mt-2 h-40 rounded-2xl border border-slate-200 bg-slate-50" />
                  <div className="mt-2 flex justify-start">
                    <GhostButton onClick={() => {}}>
                      Limpiar firma
                    </GhostButton>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Observaciones</Label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notas adicionales (opcional)"
                    className={textareaBase}
                  />
                </div>
              </div>

              <PrimaryButton type="submit" disabled={!canSubmit}>
                🧾 Registrar entrega
              </PrimaryButton>

              {!canSubmit && (
                <p className="text-center text-xs font-semibold text-slate-400">
                  Completa mensajería, unidad, tipo y destinatario para habilitar el registro.
                </p>
              )}
            </form>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <SectionTitle
                icon="🕘"
                title="Registro de entregas"
                desc="Gestiona pendientes y consulta el histórico."
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab("pending")}
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-extrabold border transition",
                    tab === "pending"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Pendientes ({pending.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTab("delivered")}
                  className={[
                    "rounded-xl px-3 py-2 text-xs font-extrabold border transition",
                    tab === "delivered"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Entregados ({delivered.length})
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {tab === "pending" && (
                <>
                  {pending.length === 0 ? (
                    <EmptyState text="No hay pendientes en portería" />
                  ) : (
                    pending.map((r) => (
                      <Row key={r.id} item={r} onDeliver={handleDeliver} />
                    ))
                  )}
                </>
              )}

              {tab === "delivered" && (
                <>
                  {delivered.length === 0 ? (
                    <EmptyState text="No hay entregas registradas" />
                  ) : (
                    delivered.map((r) => <Row key={r.id} item={r} />)
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
