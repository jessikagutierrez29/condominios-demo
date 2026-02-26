import { useMemo, useRef, useState } from "react";
import { Camera, ShieldCheck } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`app-card p-5 ${className}`}>{children}</div>
);

const Label = ({ children }) => (
  <p className="text-sm font-semibold text-slate-700">{children}</p>
);

const Hint = ({ children }) => (
  <p className="mt-2 text-xs font-semibold text-slate-500">{children}</p>
);

const ErrorText = ({ children }) => (
  <p className="mt-2 text-sm text-red-600">{children}</p>
);

const inputBase = "app-input h-14";

export default function VisitorForm({ apartments = [], onSubmit, loading }) {
  const fileRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [apartmentId, setApartmentId] = useState("");
  const [objects, setObjects] = useState("");

  const [antecedentesConsultados, setAntecedentesConsultados] = useState(false);

  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceName, setEvidenceName] = useState("");

  const [errors, setErrors] = useState({});

  const apartmentsOptions = useMemo(() => apartments || [], [apartments]);

  const canSubmit =
    fullName.trim() &&
    document.trim() &&
    phone.trim() &&
    apartmentId &&
    antecedentesConsultados &&
    !loading;

  const validate = () => {
    const next = {};
    if (!fullName.trim()) next.fullName = "Ingresa el nombre completo.";
    if (!document.trim()) next.document = "Ingresa el documento.";
    if (!phone.trim()) next.phone = "Ingresa el celular.";
    if (!apartmentId) next.apartmentId = "Selecciona el apartamento destino.";
    if (!antecedentesConsultados)
      next.antecedentes = "Debes confirmar que consultaste antecedentes.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openPicker = () => fileRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      alert("Selecciona una imagen válida.");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setEvidenceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setEvidenceName(file.name);
  };

  const clearEvidence = () => {
    setEvidenceUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setEvidenceName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetForm = () => {
    setFullName("");
    setDocument("");
    setPhone("");
    setApartmentId("");
    setObjects("");
    setAntecedentesConsultados(false);
    clearEvidence();
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit?.({
      apartment_id: Number(apartmentId),
      full_name: fullName.trim(),
      document_number: document.trim(),
      phone: phone.trim(),
      destination: `Apto ${apartmentId}`,
      carried_items: objects.trim(),
      background_check: antecedentesConsultados,
      photo: fileRef.current?.files?.[0] || null,
    });

    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Registro
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Nueva visita
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Captura evidencia, registra datos y valida antecedentes.
            </p>
          </div>
        </div>

        {/* Evidencia */}
        <div className="mt-6">
          <Label>Evidencia fotográfica</Label>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          {evidenceUrl ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={evidenceUrl}
                alt="Evidencia"
                className="h-[220px] w-full object-cover"
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
              className="mt-3 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center hover:bg-slate-100 transition"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200">
                <Camera size={20} className="text-slate-600" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                Tomar / Cargar fotografía
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Para la demo puedes cargar una imagen desde tu computador
              </p>
            </button>
          )}

          <Hint>
            Recomendado: capturar rostro del visitante para soporte de seguridad.
          </Hint>
        </div>

        {/* Datos */}
        <div className="mt-6 space-y-4">
          <div>
            <Label>Nombre completo</Label>
            <input
              className={`${inputBase} ${
                errors.fullName
                  ? "border-red-400 focus:ring-red-200"
                  : "border-slate-200 focus:ring-blue-200"
              }`}
              placeholder="Ej. Ana María Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Documento</Label>
              <input
                className={`${inputBase} ${
                  errors.document
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200"
                }`}
                placeholder="Ej. 1094..."
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
              {errors.document && <ErrorText>{errors.document}</ErrorText>}
            </div>

            <div>
              <Label>Celular</Label>
              <input
                className={`${inputBase} ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200"
                }`}
                placeholder="Ej. 300..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            </div>
          </div>

          <div>
            <Label>Apartamento destino</Label>
            <select
              className={`${inputBase} ${
                errors.apartmentId
                  ? "border-red-400 focus:ring-red-200"
                  : "border-slate-200 focus:ring-blue-200"
              }`}
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
            >
              <option value="">Selecciona apartamento</option>
              {apartmentsOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || a.number || `Apto ${a.id}`}
                </option>
              ))}
            </select>
            {errors.apartmentId && <ErrorText>{errors.apartmentId}</ErrorText>}
          </div>

          <div>
            <Label>Objetos que trae</Label>
            <textarea
              className={`app-input min-h-[110px] py-3 border border-slate-200 focus:ring-blue-200`}
              placeholder="Ej. maleta, portátil, caja..."
              value={objects}
              onChange={(e) => setObjects(e.target.value)}
            />
          </div>
        </div>

        {/* Antecedentes */}
        <div className="mt-6 space-y-3">
          <a
            href="https://antecedentes.policia.gov.co:7005/WebJudicial/"
            target="_blank"
            rel="noreferrer"
            className="app-button-secondary w-full py-3 text-sm font-extrabold text-center"
            onClick={() => setAntecedentesConsultados(true)}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Consulta de antecedentes
            </span>
          </a>

          <div className="flex items-center gap-3">
            <input
              id="antecedentes"
              type="checkbox"
              className="h-4 w-4"
              checked={antecedentesConsultados}
              onChange={(e) => setAntecedentesConsultados(e.target.checked)}
            />
            <label
              htmlFor="antecedentes"
              className="text-sm font-semibold text-slate-700"
            >
              Antecedentes consultados
            </label>
          </div>

          {errors.antecedentes && <ErrorText>{errors.antecedentes}</ErrorText>}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="app-button-primary w-full py-4 text-sm font-extrabold"
          >
            {loading ? "Guardando..." : "Registrar ingreso"}
          </button>

          <p className="mt-3 text-xs font-semibold text-slate-500">
            Para habilitar el registro, completa los campos y confirma antecedentes.
          </p>
        </div>
      </Card>
    </div>
  );
}
