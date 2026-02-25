import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Car,
  Package,
  AlertTriangle,
  Sparkles,
  Boxes,
  Settings,
  Building2,
  Menu,
} from "lucide-react";

console.log("✅ MainLayout ACTIVO");

const navOperation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/visitantes", label: "Visitantes", icon: Users },
  { to: "/vehiculos", label: "Vehículos", icon: Car },
  { to: "/correspondencia", label: "Correspondencia", icon: Package },
  { to: "/emergencias", label: "Emergencias", icon: AlertTriangle },
  { to: "/aseo/records", label: "Aseo", icon: Sparkles },
  { to: "/inventario", label: "Inventario", icon: Boxes },
];

const navOperationSafe = navOperation.filter(
  (item) => item.to !== "/control-ingreso"
);

const navConfig = [
  { to: "/ajustes", label: "Ajustes", icon: Settings },
];

function SidebarLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink to={to} className="block" onClick={onClick}>
      {({ isActive }) => (
        <div
          className={[
            "group relative flex items-center gap-3",
            "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
            isActive
              ? "bg-blue-50 text-blue-700 shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
          ].join(" ")}
        >
          <span
            className={[
              "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
              isActive ? "bg-blue-600" : "bg-transparent",
            ].join(" ")}
          />

          <Icon
            size={18}
            className={
              isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
            }
          />

          <span className="truncate">{label}</span>
        </div>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="px-7 pt-8 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
            <img
              src="/image/isotipo1.png"
              alt="GenAccess"
              className="h-8 w-auto object-contain"
            />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-extrabold text-slate-900">
              GenAccess
            </h2>
            <p className="text-xs font-bold tracking-widest text-slate-400">
              GESTIÓN INTEGRAL
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-5 pb-6 overflow-y-auto">
        <p className="px-2 mb-2 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
          Operación
        </p>

        <div className="space-y-1">
          {navOperationSafe.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              onClick={onNavigate ? () => onNavigate() : undefined}
            />
          ))}
        </div>

        <div className="my-6 h-px bg-slate-200" />

        <p className="px-2 mb-2 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
          Configuración
        </p>

        <div className="space-y-1">
          {navConfig.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              onClick={onNavigate ? () => onNavigate() : undefined}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col bg-white border-r border-slate-200">
        <SidebarContent />
      </aside>

      {/* Drawer Mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[999]">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute left-0 top-0 h-full w-[300px] bg-white border-r border-slate-200 shadow-xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Botón flotante mobile */}
      <button
        className="lg:hidden fixed top-4 right-4 z-[998] h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-800 flex items-center justify-center"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Main */}
      <div className="lg:pl-80 flex flex-col min-h-screen bg-slate-50">
        <main className="flex-1 p-4 pt-20 pb-24 lg:p-6 lg:pt-6 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}