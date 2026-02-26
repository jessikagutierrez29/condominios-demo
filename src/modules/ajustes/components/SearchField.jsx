export default function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="px-5">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="app-input h-14 text-base"
        />
      </div>
    </div>
  );
}
