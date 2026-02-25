const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-sm font-extrabold text-slate-900">Sin visitantes activos</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">
        Cuando registres ingresos, aparecerán aquí para controlar la salida.
      </p>
    </div>
  );
}

function Row({ visit, onCheckout }) {
  const name = visit?.full_name || "Visitante";
  const doc = visit?.document_number || "";
  const aptObject = visit?.apartment;

  const apt =
    visit?.apartment_name ||
    (aptObject
      ? `Torre ${aptObject.tower} - Apto ${aptObject.number}`
      : visit?.apartment_id
      ? `Apto ${visit.apartment_id}`
      : "");

  const time = visit?.check_in_at || visit?.created_at || "";
  const isActive = visit?.status === "active";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:shadow-sm transition">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-4 min-w-0">

        {/* FOTO */}
        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
          {visit.photo ? (
            <img
              src={`http://127.0.0.1:8000/storage/${visit.photo}`}
              alt="Foto visitante"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-200" />
          )}
        </div>

        {/* INFO */}
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {name}
          </p>

          <p className="text-xs text-slate-500 truncate">
            {doc ? `Doc: ${doc} • ` : ""}
            {apt || "Destino no definido"}
          </p>

          {time && (
            <p className="text-[11px] text-slate-400 mt-1">
              {new Date(time).toLocaleDateString("es-CO")}
            </p>
          )}
        </div>
      </div>

      {/* DERECHA */}
      <div className="flex items-center">

        {isActive ? (
          <button
            type="button"
            onClick={() => onCheckout?.(visit.id)}
            className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 transition whitespace-nowrap"
          >
            Registrar salida
          </button>
        ) : (
          <span className="rounded-xl bg-green-100 px-3 py-2 text-xs font-bold text-green-700 border border-green-200 whitespace-nowrap">
            Cerrada
          </span>
        )}

      </div>
    </div>
  );
}
export default function VisitorsList({ visits = [], onCheckout }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Control en tiempo real
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Visitantes actuales ({visits?.length || 0})
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Registra la salida para mantener el control del acceso.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {!visits || visits.length === 0 ? (
          <EmptyState />
        ) : (
          visits.map((v) => (
            <Row key={v.id || `${v.document}-${v.created_at}`} visit={v} onCheckout={onCheckout} />
          ))
        )}
      </div>
    </Card>
  );
}