export default function Card({ className = "", children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        "app-card",
        onClick ? "cursor-pointer active:scale-[0.99] transition" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
