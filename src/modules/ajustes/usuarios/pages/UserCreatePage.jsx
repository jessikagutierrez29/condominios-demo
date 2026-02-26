import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { createUser } from "../service/user.service";

export default function UserCreatePage() {
  const navigate = useNavigate();

  /* ================================
     FORM STATE
  ================================= */

  const [fullName, setFullName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const rolesMock = [
    { id: 2, name: "administrador" },
    { id: 3, name: "seguridad" },
    { id: 4, name: "aseo" },
    { id: 5, name: "mantenimiento" },
    { id: 6, name: "residente" },
  ];

  const validate = () => {
    const next = {};

    if (!fullName.trim()) next.fullName = "Ingrese el nombre completo.";
    if (!documentNumber.trim()) next.documentNumber = "Ingrese el documento.";
    if (!email.trim()) next.email = "Ingrese el correo.";
    if (!password.trim()) next.password = "Ingrese la contraseña.";
    if (!role) next.role = "Seleccione un rol.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSave = async () => {
  setSubmitError("");

  if (!validate()) return;

  try {
    await createUser({
      full_name: fullName,
      document_number: documentNumber,
      email: email,
      phone: phone || null,
      birth_date: birthDate || null,
      password: password,
      is_active: isActive,
      role_id: role,
      condominium_id: 1, // luego lo sacamos dinámico
    });

    navigate("/ajustes/usuarios?created=1");

  } catch (e) {
    console.error("Error backend:", e.response?.data);
    setSubmitError("No se pudo registrar el usuario.");
  }
};


  const canSubmit =
    fullName &&
    documentNumber &&
    email &&
    password &&
    role;

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto p-6">
        <PageHeader title="Registrar Usuario" showBack />

        {submitError && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            ❌ {submitError}
          </div>
        )}

        {/* 1. INFORMACIÓN PERSONAL */}
        <SectionHeader number="1" title="Información Personal" />

        <CardBlock>
          <InputField
            label="Nombre completo"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Documento"
              value={documentNumber}
              onChange={setDocumentNumber}
              error={errors.documentNumber}
            />

            <InputField
              label="Fecha de nacimiento"
              type="date"
              value={birthDate}
              onChange={setBirthDate}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Correo electrónico"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />

            <InputField
              label="Teléfono"
              value={phone}
              onChange={setPhone}
            />
          </div>
        </CardBlock>

        {/* 2. SEGURIDAD */}
        <SectionHeader number="2" title="Seguridad" />

        <CardBlock>
          <InputField
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">Usuario activo</p>
              <p className="text-sm text-slate-500">
                Permitir acceso al sistema
              </p>
            </div>

            <Switch checked={isActive} onChange={setIsActive} />
          </div>
        </CardBlock>

        {/* 3. ROL */}
        <SectionHeader number="3" title="Rol en el Condominio" />

        <CardBlock>
          <p className="text-sm font-semibold text-slate-700">
            Seleccione el rol
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rolesMock.map((r) => {
              const active = role === r.id;

              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`h-14 rounded-2xl border px-4 flex items-center gap-3 transition ${
                    active
                      ? "border-blue-300 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      active ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {active && (
                      <span className="h-3 w-3 rounded-full bg-blue-600" />
                    )}
                  </span>

                  <span className="font-semibold capitalize">
                    {r.name}
                  </span>
                </button>
              );
            })}
          </div>

          {errors.role && (
            <p className="mt-2 text-sm text-red-600">{errors.role}</p>
          )}
        </CardBlock>

        {/* BOTÓN */}
        <div className="mt-10 pb-32 flex justify-center">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSave}
            className="app-button-primary w-full sm:w-[520px] py-4 text-lg font-semibold"
          >
            👤 Crear Usuario
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI HELPERS ================= */

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
    <div className="mt-4 app-card p-5">
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <p className={`text-sm font-semibold ${error ? "text-red-600" : "text-slate-700"}`}>
        {label}
      </p>
      <input
        type={type}
        className={`mt-2 app-input h-14 ${
          error ? "border border-red-400 focus:ring-red-200" : "border border-slate-200 focus:ring-blue-200"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full transition relative ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`h-7 w-7 bg-white rounded-full absolute top-0.5 transition ${
          checked ? "left-6" : "left-0.5"
        }`}
      />
    </button>
  );
}
