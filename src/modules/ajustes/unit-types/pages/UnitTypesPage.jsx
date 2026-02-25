import UnitTypeForm from "../components/UnitTypeForm";
import UnitTypeList from "../components/UnitTypeList";
import { useUnitTypes } from "../hooks/useUnitTypes";


export default function UnitTypesPage() {

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

      <h1 className="text-xl font-bold">
        Tipos de Unidad
      </h1>

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
