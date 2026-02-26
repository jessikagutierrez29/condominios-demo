import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, Lock, Mail } from "lucide-react";
import { isAuthenticated, login } from "./authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({
        username: form.username.trim(),
        password: form.password,
        useMock: true,
      });
      navigate(from, { replace: true });
    } catch {
      setError("Usuario o contraseña inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="app-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <img
                src="/image/genaccess-logo.png"
                alt="GenAccess"
                className="h-7 w-auto object-contain"
              />
            </div>

            <h1 className="text-xl font-extrabold text-slate-900">Bienvenido</h1>
            <p className="mt-1 text-xs text-slate-500">
              Ingresa tus credenciales para continuar al panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="nombre@condominio.com"
                  className="app-input pl-9"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="app-input pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  aria-label="Mostrar contraseña"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" />
                Recordarme
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="app-button-primary w-full py-3 font-semibold"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión →"}
            </button>
          </form>

          <div className="mt-4 flex justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">
              Demo: admin / 1234
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
