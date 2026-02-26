import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api";
import {
  demoFetchApartments,
  demoFetchVehicleTypes,
  demoFetchSecurityUsers,
  demoFetchVehicles,
  demoCreateVehicle,
  demoFetchVehicleEntries,
  demoCreateVehicleEntry,
  demoCheckoutVehicleEntry,
} from "../../../service/demoStore";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
import { ArrowLeft, Camera, Car } from "lucide-react";

const condominiumId = 1;

/* ---------------- UI helpers (mismo estilo que Visitantes) ---------------- */

const Card = ({ children, className = "" }) => (
  <div className={["app-card p-6", className].join(" ")}>
    {children}
  </div>
);

const SmallTag = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-extrabold text-slate-700">
    {children}
  </span>
);

const FieldLabel = ({ children, required }) => (
  <div className="flex items-center justify-between">
    <p className="text-sm font-semibold text-slate-700">{children}</p>
    {required && <span className="text-[11px] font-semibold text-slate-400">Obligatorio</span>}
  </div>
);

const inputBase = "app-input";

function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-sm font-extrabold text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{subtitle}</p>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function VehicleEntryPage() {
  const navigate = useNavigate();

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [securityUsers, setSecurityUsers] = useState([]);

  const [loadingInit, setLoadingInit] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeEntries, setActiveEntries] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);

  const [form, setForm] = useState({
    tipoUsuario: "",
    placa: "",
    vehicleTypeId: "",
    apartmentId: "",
    responsable: "",
    observaciones: "",
  });

  // Evidencia demo (solo UI)
  const fileRef = useRef(null);
  const [evidencePreview, setEvidencePreview] = useState("");

  useEffect(() => {
    loadInitialData();
    loadActiveEntries();
  }, []);

  const ownerTypeMap = useMemo(
    () => ({
      Residente: "resident",
      Visitante: "visitor",
      Proveedor: "provider",
      Mantenimiento: "provider",
    }),
    []
  );

  async function loadInitialData() {
    setLoadingInit(true);
    try {
      if (DEMO_MODE) {
        const [typesRes, apartmentsRes, usersRes] = await Promise.all([
          demoFetchVehicleTypes(condominiumId),
          demoFetchApartments(condominiumId),
          demoFetchSecurityUsers(condominiumId),
        ]);
        setVehicleTypes(typesRes.data || []);
        setApartments(apartmentsRes.data || []);
        setSecurityUsers(usersRes || []);
      } else {
        const [typesRes, apartmentsRes, usersRes] = await Promise.all([
          api.get("/security/vehicle-types"),
          api.get(`/core/apartments?condominium_id=${condominiumId}`),
          api.get(`/core/users/security/${condominiumId}`),
        ]);

        setVehicleTypes(typesRes.data || []);
        setApartments(apartmentsRes.data || []);
        setSecurityUsers(usersRes.data || []);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoadingInit(false);
    }
  }

  async function loadActiveEntries() {
    setLoadingActive(true);
    try {
      const entriesRes = DEMO_MODE
        ? await demoFetchVehicleEntries(condominiumId)
        : await api.get(`/security/vehicle-entries/${condominiumId}`);
      const list = Array.isArray(entriesRes.data) ? entriesRes.data : [];
      setActiveEntries(list.filter((e) => e?.status === "active"));
    } catch (err) {
      console.error("Error cargando vehículos activos:", err);
      setActiveEntries([]);
    } finally {
      setLoadingActive(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm({
      tipoUsuario: "",
      placa: "",
      vehicleTypeId: "",
      apartmentId: "",
      responsable: "",
      observaciones: "",
    });
    setEvidencePreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function normalizePlate(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "")
      .slice(0, 12);
  }

  /* ---------------- Registrar ingreso (1 solo botón) ---------------- */

  const onRegisterIngreso = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const plate = normalizePlate(form.placa);

    if (!form.tipoUsuario || !plate || !form.vehicleTypeId) {
      alert("Completa los campos obligatorios: Tipo de usuario, Placa y Tipo de vehículo.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Buscar vehículo por placa (en tu backend actual o demo)
      const vehiclesRes = DEMO_MODE
        ? await demoFetchVehicles(condominiumId)
        : await api.get(`/security/vehicles?condominium_id=${condominiumId}`);
      const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
      let vehicle = vehicles.find((v) => String(v?.plate || "").toUpperCase() === plate);

      // 2) Crear vehículo si no existe
      if (!vehicle) {
        const newVehicleRes = DEMO_MODE
          ? await demoCreateVehicle({
              condominium_id: condominiumId,
              vehicle_type_id: Number(form.vehicleTypeId),
              apartment_id: form.apartmentId ? Number(form.apartmentId) : null,
              plate,
              registered_by_id: form.responsable ? Number(form.responsable) : null,
              owner_type: ownerTypeMap[form.tipoUsuario],
              is_active: true,
            })
          : await api.post("/security/vehicles", {
              condominium_id: condominiumId,
              vehicle_type_id: Number(form.vehicleTypeId),
              apartment_id: form.apartmentId ? Number(form.apartmentId) : null,
              plate,
              registered_by_id: form.responsable ? Number(form.responsable) : null,
              owner_type: ownerTypeMap[form.tipoUsuario],
              is_active: true,
            });

        vehicle = newVehicleRes.data;
      }

      // 3) Registrar ingreso (entrada activa)
      if (DEMO_MODE) {
        await demoCreateVehicleEntry({
          condominium_id: condominiumId,
          vehicle_id: vehicle.id,
          registered_by_id: form.responsable ? Number(form.responsable) : null,
          observations: form.observaciones || "",
        });
      } else {
        await api.post("/security/vehicle-entries", {
          condominium_id: condominiumId,
          vehicle_id: vehicle.id,
          registered_by_id: form.responsable ? Number(form.responsable) : null,
          observations: form.observaciones || "",
          // evidencia demo NO se envía (solo UI)
        });
      }

      resetForm();
      await loadActiveEntries();
      alert("Ingreso registrado correctamente");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error registrando ingreso");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Registrar salida desde la lista (control tiempo real) ---------------- */

  async function onCheckoutEntry(entry) {
    if (!entry?.id) return;
    const ok = confirm("¿Registrar salida de este vehículo?");
    if (!ok) return;

    try {
      if (DEMO_MODE) {
        await demoCheckoutVehicleEntry(entry.id);
      } else {
        await api.put(`/security/vehicle-entries/checkout/${entry.id}`);
      }
      await loadActiveEntries();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error registrando salida");
    }
  }

  /* ---------------- Evidencia demo (upload local) ---------------- */

  function handlePickEvidence() {
    fileRef.current?.click();
  }

  function onEvidenceChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setEvidencePreview(url);
  }

  function removeEvidence() {
    setEvidencePreview("");
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        {/* Header armonizado */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            GESTIÓN DE ACCESOS
          </p>

          <div className="mt-1 flex items-center gap-3">
            <button
              type="button"
              className="h-10 w-10 rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex items-center justify-center"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} className="text-slate-700" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Ingreso Vehicular</h1>
              <p className="mt-1 text-sm text-slate-500">
                Registra el ingreso y controla la salida en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Layout igual que Visitantes: 1 col mobile / 2 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: FORM */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  REGISTRO
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Nuevo ingreso</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa los datos y registra el ingreso del vehículo.
                </p>
              </div>

              {loadingInit ? <SmallTag>Cargando...</SmallTag> : <SmallTag>Formulario</SmallTag>}
            </div>

            <form onSubmit={onRegisterIngreso} className="mt-6 space-y-5">
              {/* Evidencia demo */}
              <div>
                <FieldLabel>Evidencia fotográfica</FieldLabel>
                <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onEvidenceChange}
                  />

                  {!evidencePreview ? (
                    <>
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Camera size={20} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        Tomar / Cargar fotografía
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Para la demo puedes cargar una imagen desde tu computador
                      </p>

                      <button
                        type="button"
                        onClick={handlePickEvidence}
                        className="mt-4 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                      >
                        Cargar imagen
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={evidencePreview}
                          alt="Evidencia"
                          className="h-40 w-full object-cover"
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handlePickEvidence}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
                        >
                          Cambiar
                        </button>
                        <button
                          type="button"
                          onClick={removeEvidence}
                          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100"
                        >
                          Quitar
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Recomendado: capturar la placa para soporte de seguridad.
                </p>
              </div>

              {/* Tipo usuario */}
              <div>
                <FieldLabel required>Tipo de usuario</FieldLabel>
                <select
                  name="tipoUsuario"
                  value={form.tipoUsuario}
                  onChange={handleChange}
                  className={`${inputBase} mt-2`}
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="Residente">Residente</option>
                  <option value="Visitante">Visitante</option>
                  <option value="Proveedor">Proveedor</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>

              {/* Placa + tipo vehículo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Placa del vehículo</FieldLabel>
                  <input
                    name="placa"
                    value={form.placa}
                    onChange={handleChange}
                    placeholder="ABC-123"
                    className={`${inputBase} mt-2`}
                  />
                </div>

                <div>
                  <FieldLabel required>Tipo de vehículo</FieldLabel>
                  <select
                    name="vehicleTypeId"
                    value={form.vehicleTypeId}
                    onChange={handleChange}
                    className={`${inputBase} mt-2`}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Unidad */}
              <div>
                <FieldLabel>Unidad (opcional)</FieldLabel>
                <select
                  name="apartmentId"
                  value={form.apartmentId}
                  onChange={handleChange}
                  className={`${inputBase} mt-2`}
                >
                  <option value="">Seleccionar unidad...</option>
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Responsable */}
              <div>
                <FieldLabel>Responsable de turno (opcional)</FieldLabel>
                <select
                  name="responsable"
                  value={form.responsable}
                  onChange={handleChange}
                  className={`${inputBase} mt-2`}
                >
                  <option value="">Seleccionar responsable...</option>
                  {securityUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Observaciones */}
              <div>
                <FieldLabel>Observaciones (opcional)</FieldLabel>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  placeholder="Ej: Vehículo con golpe en puerta derecha..."
                  className={`${inputBase} mt-2 min-h-[110px] py-3`}
                />
              </div>

              {/* Botón único */}
              <button
                type="submit"
                disabled={submitting}
                className={[
                  "w-full rounded-2xl py-4 text-sm font-extrabold shadow-sm transition",
                  submitting
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]",
                ].join(" ")}
              >
                {submitting ? "Registrando..." : "Registrar ingreso"}
              </button>

              <p className="text-center text-xs font-semibold text-slate-400">
                Completa los campos obligatorios para habilitar el registro.
              </p>

              {/* Opcional: Reportar novedad como link (no es botón principal) */}
              <button
                type="button"
                onClick={() => navigate("/vehiculos/novedad")}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
              >
                Reportar novedad
              </button>
            </form>
          </Card>

          {/* RIGHT: REALTIME LIST */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  CONTROL EN TIEMPO REAL
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Vehículos actuales ({activeEntries.length})
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Registra la salida para mantener el control del parqueadero.
                </p>
              </div>

              <button
                type="button"
                onClick={loadActiveEntries}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-800 hover:bg-slate-50"
              >
                Actualizar
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {loadingActive ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  Cargando vehículos activos...
                </div>
              ) : !activeEntries || activeEntries.length === 0 ? (
                <EmptyState
                  title="Sin vehículos activos"
                  subtitle="Cuando registres ingresos, aparecerán aquí para controlar la salida."
                />
              ) : (
                activeEntries.map((entry) => {
                  const plate = entry?.vehicle?.plate || "—";
                  const ownerType = entry?.vehicle?.owner_type || "—";
                  const unit = entry?.vehicle?.apartment?.number || entry?.vehicle?.apartment_id || "—";
                  const createdAt = entry?.created_at || entry?.check_in_time || "";

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                          🚗
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-900">
                            {plate}
                          </p>
                          <p className="truncate text-[11px] font-semibold text-slate-500">
                            {`Tipo: ${ownerType} • Unidad: ${unit}`}
                          </p>
                          {createdAt && (
                            <p className="truncate text-[11px] font-semibold text-slate-400">
                              {String(createdAt).slice(0, 19).replace("T", " ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCheckoutEntry(entry)}
                        className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-extrabold text-rose-700 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Registrar salida
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
