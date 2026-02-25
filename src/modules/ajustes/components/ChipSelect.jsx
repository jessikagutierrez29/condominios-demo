import { useEffect, useRef, useState } from "react";

export default function ChipSelect({
  label,
  valueLabel,
  active,
  options = [],
  onSelect,
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition
          ${
            active
              ? "bg-blue-700 text-white shadow"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        aria-expanded={open}
      >
        {valueLabel || label} <span className="ml-1">▼</span>
      </button>

      {open && (
        <div
          className={`absolute z-20 mt-2 min-w-[220px] rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="px-4 py-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
            {label}
          </div>

          <div className="max-h-64 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onSelect?.(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-semibold transition ${
                  opt.active
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
