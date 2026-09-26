const STAR_PATH =
  "M12 2.5 14.53 9.6h7.47l-6.04 4.39 2.3 7.02L12 16.6l-6.26 4.4 2.3-7.02L2 9.6h7.47L12 2.5Z";

function StarRow({ className }: { className: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

export function StarRating({ rating }: { rating: number }) {
  const fillPercent = Math.max(0, Math.min(1, rating / 5)) * 100;

  return (
    <div className="relative inline-flex">
      <StarRow className="text-black/15" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fillPercent}%` }}
      >
        <StarRow className="text-[#00b67a]" />
      </div>
    </div>
  );
}
