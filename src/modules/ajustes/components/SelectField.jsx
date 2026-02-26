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
          className="app-input h-14 text-lg"
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
