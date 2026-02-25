export default function Pill({ variant = "neutral", children, className = "" }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
        styles[variant] || styles.neutral,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
