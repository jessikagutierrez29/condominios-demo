import { useNavigate } from "react-router-dom";
import UnitTypeForm from "../components/UnitTypeForm";
import UnitTypeList from "../components/UnitTypeList";
import { useUnitTypes } from "../hooks/useUnitTypes";


export default function UnitTypesPage() {
  const navigate = useNavigate();

  const condominiumId = 1; // luego dinámico

  const {
    unitTypes,
    loading,
    registerUnitType,
    editUnitType,
    removeUnitType,
  } = useUnitTypes(condominiumId);

  return (
    <div className="p-5 space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="app-button-secondary px-4 py-2 text-sm"
      >
        ← Volver
      </button>

      <h1 className="text-xl font-bold">Tipos de Unidad</h1>

      <UnitTypeForm
        loading={loading}
        onSubmit={registerUnitType}
      />

      <UnitTypeList
        unitTypes={unitTypes}
        onUpdate={editUnitType}
        onDelete={removeUnitType}
      />


    </div>  
  );
}
