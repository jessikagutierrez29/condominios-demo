import { useMemo, useState } from "react";
import HybridAttendanceButton from "../components/HybridAttendanceButton";

export default function ControlIngresoPage() {
  // Mock: empleado seleccionado
  const selectedEmployee = useMemo(
    () => ({ id: 1, name: "Juan Alberto Pérez García" }),
    []
  );

  // Estado: si está presente (esto luego te llega del backend / turno)
  const [isPresent, setIsPresent] = useState(true); // true => muestra SALIDA, false => muestra INGRESO
  const [saving, setSaving] = useState(false);

  const handleToggleAttendance = async () => {
    if (!selectedEmployee?.id || saving) return;

    try {
      setSaving(true);

      // ✅ Aquí llamas tu backend:
      // si isPresent === false => registrar INGRESO
      // si isPresent === true  => registrar SALIDA
      //
      // Ejemplo:
      // await attendanceService.register({
      //   employee_id: selectedEmployee.id,
      //   type: isPresent ? "SALIDA" : "INGRESO",
      //   // evidencePhoto: ...
      // });

      // Mock (simula guardar)
      await new Promise((r) => setTimeout(r, 350));

      // ✅ UI: alterna el botón
      setIsPresent((prev) => !prev);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* ...todo tu layout igual... */}

      {/* Dentro de la card del empleado, donde estaban los 2 botones */}
      <div className="mt-5 flex justify-center">
        <HybridAttendanceButton
          isPresent={isPresent}
          disabled={saving}
          onToggle={handleToggleAttendance}
        />
      </div>

      {/* ...resto igual... */}
    </div>
  );
}
