import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  rightSlot = null,
}) {
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-1 text-blue-700 font-semibold"
            >
              ←
            </button>
          )}

          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-1 text-slate-500 text-base whitespace-pre-line">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {rightSlot}
      </div>
    </div>
  );
}
