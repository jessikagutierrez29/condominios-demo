export default function Card({ className = "", children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        "rounded-2xl bg-white shadow-sm border border-slate-100",
        onClick ? "cursor-pointer active:scale-[0.99] transition" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
