export default function FilterChip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition
        ${
          active
            ? "bg-blue-700 text-white shadow"
            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
    >
      {children}
    </button>
  );
}
