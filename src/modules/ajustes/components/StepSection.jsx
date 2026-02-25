import Card from "./Card";

export default function StepSection({ step, title, children }) {
  return (
    <div className="px-5 mt-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">
          {step}
        </div>
        <h2 className="text-xl font-extrabold text-blue-800 tracking-wide">
          {title.toUpperCase()}
        </h2>
      </div>

      <Card className="p-4">{children}</Card>
    </div>
  );
}
