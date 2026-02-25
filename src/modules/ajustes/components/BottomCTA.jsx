export default function BottomCTA({ label, onClick }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto px-5 pb-[calc(env(safe-area-inset-bottom)+18px)]">
        <div className="flex justify-center pointer-events-auto">
          <button
            type="button"
            onClick={onClick}
            className="w-full sm:w-[520px] rounded-2xl bg-blue-600 text-white font-semibold py-4 text-lg shadow-xl transition hover:bg-blue-700 active:scale-[0.99] ring-1 ring-black/5"
          >
            + {label}
          </button>
        </div>
      </div>
    </div>
  );
}
