export default function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div className="px-5">
      {label && (
        <p className="text-slate-500 text-sm font-semibold tracking-widest">
          {label.toUpperCase()}
        </p>
      )}

      <div className="mt-3">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-lg text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
