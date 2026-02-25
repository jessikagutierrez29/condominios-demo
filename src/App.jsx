import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Módulos principales
import DashboardPage from "./modules/dashboard/DashboardPage";
import VisitorsPage from "./modules/visitantes/page/VisitorsPage";
import VehiclesPage from "./modules/vehiculos/VehiclesPage";
import EmergenciesPage from "./modules/emergencias/EmergenciesPage";
import CleaningPage from "./modules/aseo/CleaningPage";
import InventoryMaintenancePage from "./modules/inventario/InventoryMaintenancePage";

// ✅ NUEVO: Control de ingreso (personal)
import ControlIngresoPage from "./modules/control-ingreso/pages/ControlIngresoPage";

// Correspondencia
import CorrespondenceRegisterPage from "./modules/correspondencia/page/CorrespondenceRegisterPage";

// Ajustes
import UnitTypesPage from "../src/modules/ajustes/unit-types/pages/UnitTypesPage";
import ApartmentsPage from "../src/modules/ajustes/apartamentos/pages/ApartmentsPage";
import ApartmentCreatePage from "../src/modules/ajustes/apartamentos/pages/ApartmentCreatePage";
import UserDetailPage from "./modules/ajustes/usuarios/pages/UserDetailPage";
import VehicleTypePage from "./modules/ajustes/tipos-vehiculos/pages/VehicleTypePage";
import VehicleTypeCreatePage from "./modules/ajustes/tipos-vehiculos/pages/VehicleTypeCreatePage";
import SettingsPage from "../src/modules/ajustes/pages/SettingsPage";
import ApartmentDetailPage from "../src/modules/ajustes/apartamentos/pages/ApartmentDetailPage";
import UserPage from "./modules/ajustes/usuarios/pages/UserPage";
import UserCreatePage from "./modules/ajustes/usuarios/pages/UserCreatePage";

// Vehículos
import VehicleEntryPage from "./modules/vehiculos/pages/VehicleEntryPage";
import VehicleIncidentPage from "./modules/vehiculos/novedades/page/VehicleIncidentPage";

// Ajustes → Aseo
import CleaningSettingsPage from "./modules/ajustes/aseo/page/CleaningSettingsPage";
import CleaningRecordPage from "./modules/ajustes/aseo/page/CleaningRecordPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<DashboardPage />} />

        {/* ✅ Control ingreso */}
        <Route path="/control-ingreso" element={<ControlIngresoPage />} />

        {/* Módulos */}
        <Route path="/visitantes" element={<VisitorsPage />} />

        <Route path="/vehiculos" element={<VehiclesPage />} />
        <Route path="/vehiculos/ingreso" element={<VehicleEntryPage />} />
        <Route path="/vehiculos/novedad" element={<VehicleIncidentPage />} />

        <Route path="/correspondencia" element={<CorrespondenceRegisterPage />} />
        <Route path="/emergencias" element={<EmergenciesPage />} />
        <Route path="/aseo" element={<CleaningPage />} />
        <Route path="/aseo/records" element={<CleaningRecordPage />} />
        <Route path="/inventario" element={<InventoryMaintenancePage />} />

        {/* Ajustes */}
        <Route path="/ajustes" element={<SettingsPage />} />
        <Route path="/ajustes/aseo" element={<CleaningSettingsPage />} />

        {/* Ajustes → Operativo */}
        <Route path="/ajustes/unidades" element={<UnitTypesPage />} />
        <Route path="/ajustes/apartamentos" element={<ApartmentsPage />} />
        <Route path="/ajustes/apartamentos/crear" element={<ApartmentCreatePage />} />
        <Route path="/ajustes/apartamentos/:id" element={<ApartmentDetailPage />} />
        <Route path="/ajustes/usuarios" element={<UserPage />} />
        <Route path="/ajustes/usuarios/:id" element={<UserDetailPage />} />
        <Route path="/ajustes/usuarios/crear" element={<UserCreatePage />} />
        <Route path="/ajustes/tipos-vehiculos" element={<VehicleTypePage />} />
        <Route path="/ajustes/tipos-vehiculos/crear" element={<VehicleTypeCreatePage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
