import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { useApartments } from "../hooks/useApartments";
import { useUnitTypes } from "../../unit-types/hooks/useUnitTypes";

export default function ApartmentCreatePage() {
  const navigate = useNavigate();

  const condominiumId = 1; // luego se toma del auth

  // Datos reales
  const {
    apartments,
    loading: loadingApartments,
    registerApartment,
  } = useApartments(condominiumId);

  const { unitTypes, loading: loadingUnitTypes } = useUnitTypes(condominiumId);

  // Form state (mapeado a backend)
  const [torre, setTorre] = useState("");
  const [piso, setPiso] = useState("");
  const [numero, setNumero] = useState("");
  const [unitTypeId, setUnitTypeId] = useState("");

  // Campos UI que aún NO están en backend (se mantienen solo visualmente)
  const [activoCobro, setActivoCobro] = useState(true);
  const [observaciones, setObservaciones] = useState("");

  // Validation
  const [numeroDuplicado, setNumeroDuplicado] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Valida duplicado en vivo
  useEffect(() => {
    setSubmitError("");

    if (!torre || !numero.trim()) {
      setNumeroDuplicado(false);
      return;
    }

    const exists = apartments.some(
      (a) =>
        String(a.tower || "").trim().toLowerCase() ===
          String(torre || "").trim().toLowerCase() &&
        String(a.number || "").trim().toLowerCase() ===
          String(numero || "").trim().toLowerCase()
    );

    setNumeroDuplicado(exists);
  }, [torre, numero, apartments]);

  // Limpia errores al editar
  useEffect(() => {
    setErrors((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev;

      const next = { ...prev };

      if (torre && next.torre) delete next.torre;
      if (String(piso).trim() !== "" && next.piso) delete next.piso;
      if (numero.trim() && next.numero) delete next.numero;
      if (unitTypeId && next.unitTypeId) delete next.unitTypeId;

      if (!numeroDuplicado && next.numero === "Este número ya existe en la torre.") {
        delete next.numero;
      }

      return next;
    });
  }, [torre, piso, numero, unitTypeId, numeroDuplicado]);

  const canSubmit =
    torre.trim() &&
    String(piso).trim() !== "" &&
    numero.trim() &&
    unitTypeId &&
    !numeroDuplicado;

  const validate = () => {
    const nextErrors = {};

    if (!torre.trim()) nextErrors.torre = "Ingrese la torre.";
    if (String(piso).trim() === "") nextErrors.piso = "Ingrese el piso.";
    if (!numero.trim()) nextErrors.numero = "Ingrese el número.";
    if (!unitTypeId) nextErrors.unitTypeId = "Seleccione el tipo de unidad.";

    if (torre.trim() && numero.trim() && numeroDuplicado) {
      nextErrors.numero = "Este número ya existe en la torre.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    setSubmitError("");

    const ok = validate();
    if (!ok) return;

    try {
      // Payload real del backend
      await registerApartment({
        unit_type_id: Number(unitTypeId),
        tower: String(torre).trim(), // ✅ sigue guardando igual
        floor: Number(piso),
        number: String(numero).trim(),
        is_active: true,
      });

      navigate("/ajustes/apartamentos?created=1", { replace: true });
    } catch (e) {
      setSubmitError("No se pudo guardar el apartamento.");
      console.error(e);
    }
  };

  const busy = loadingApartments || loadingUnitTypes;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-4xl mx-auto p-6">
        <PageHeader title="Registrar Apartamento" showBack />

        {busy && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-600 text-sm">
            Cargando datos...
          </div>
        )}

        {/* ERROR GLOBAL */}
        {submitError && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {submitError}
          </div>
        )}

        {/* 1. UBICACIÓN */}
        <SectionHeader number="1" title="Ubicación" />

        <CardBlock>
          {/* ✅ Torre editable */}
          <div>
            <FieldLabel label="Torre / Bloque" danger={Boolean(errors.torre)} />
            <input
              type="text"
              className={`mt-2 w-full h-14 rounded-2xl bg-white px-4 text-slate-900 outline-none focus:ring-2 ${
                errors.torre
                  ? "border border-red-400 focus:ring-red-200"
                  : "border border-slate-200 focus:ring-blue-200"
              }`}
              placeholder="Ej. Torre A"
              value={torre}
              onChange={(e) => setTorre(e.target.value)}
              disabled={loadingApartments}
            />
            {errors.torre && <FieldError>{errors.torre}</FieldError>}
          </div>

          {/* Piso / Número */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Piso" danger={Boolean(errors.piso)} />
              <input
                type="number"
                inputMode="numeric"
                className={`mt-2 w-full h-14 rounded-2xl bg-white px-4 text-slate-900 outline-none focus:ring-2 ${
                  errors.piso
                    ? "border border-red-400 focus:ring-red-200"
                    : "border border-slate-200 focus:ring-blue-200"
                }`}
                placeholder="Ej. 12"
                value={piso}
                onChange={(e) => setPiso(e.target.value)}
              />
              {errors.piso && <FieldError>{errors.piso}</FieldError>}
            </div>

            <div>
              <FieldLabel
                label="Número"
                danger={Boolean(errors.numero) || numeroDuplicado}
              />
              <input
                type="text"
                className={`mt-2 w-full h-14 rounded-2xl bg-white px-4 text-slate-900 outline-none focus:ring-2 ${
                  errors.numero || numeroDuplicado
                    ? "border border-red-400 focus:ring-red-200"
                    : "border border-slate-200 focus:ring-blue-200"
                }`}
                placeholder="Ej. 1204"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />

              {errors.numero ? (
                <FieldError>{errors.numero}</FieldError>
              ) : (
                numeroDuplicado && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700">
                      !
                    </span>
                    Este número ya existe en la torre
                  </p>
                )
              )}
            </div>
          </div>

          {/* Tipo de Unidad */}
          <div className="mt-6">
            <FieldLabel
              label="Tipo de Unidad"
              danger={Boolean(errors.unitTypeId)}
            />
            <select
              className={`mt-2 w-full h-14 rounded-2xl bg-white px-4 text-slate-900 outline-none focus:ring-2 ${
                errors.unitTypeId
                  ? "border border-red-400 focus:ring-red-200"
                  : "border border-slate-200 focus:ring-blue-200"
              }`}
              value={unitTypeId}
              onChange={(e) => setUnitTypeId(e.target.value)}
              disabled={loadingUnitTypes}
            >
              <option value="">Seleccione tipo</option>
              {unitTypes.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.unitTypeId && <FieldError>{errors.unitTypeId}</FieldError>}
          </div>
        </CardBlock>

        {/* 2. ADMINISTRATIVOS */}
        <SectionHeader number="2" title="Administrativos" />

        <CardBlock>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">Estado de la unidad</p>
              <p className="text-sm text-slate-500">Activa para cobro de cuotas</p>
            </div>

            <Switch checked={activoCobro} onChange={setActivoCobro} />
          </div>

          {/* Observaciones (solo UI, no backend todavía) */}
          <div className="mt-5">
            <FieldLabel label="Observaciones (opcional)" danger={false} />
            <textarea
              className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Detalles adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </CardBlock>

        <div className="mt-10 pb-32 flex justify-center">
          <button
            type="button"
            disabled={!canSubmit || busy}
            onClick={handleSave}
            className={`w-full sm:w-[520px] rounded-2xl py-4 text-lg font-semibold shadow-xl transition ${
              canSubmit && !busy
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Guardar Apartamento
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- UI Helpers ----------------- */

function SectionHeader({ number, title }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold">
        {number}
      </div>
      <h2 className="text-xl font-extrabold tracking-wide text-blue-800 uppercase">
        {title}
      </h2>
    </div>
  );
}

function CardBlock({ children }) {
  return (
    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FieldLabel({ label, danger }) {
  return (
    <p className={`text-sm font-semibold ${danger ? "text-red-600" : "text-slate-700"}`}>
      {label}
    </p>
  );
}

function FieldError({ children }) {
  return <p className="mt-2 text-sm text-red-600">{children}</p>;
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full transition relative ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
      aria-label="Cambiar estado"
    >
      <span
        className={`h-7 w-7 bg-white rounded-full absolute top-0.5 transition ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}