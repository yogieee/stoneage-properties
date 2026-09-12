interface StarIconProps {
  className?: string;
  size?: string;
  bold?: boolean;
}

export function StarIcon({ className = "", size = "w-4 h-4", bold = false }: StarIconProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${size} ${className}`} aria-hidden="true">
      <div className="relative w-full h-full group-hover:rotate-90 transition-transform duration-500 ease-out">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom h-1/2 ${bold ? "w-[26%]" : "w-[15%]"}`}
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className={`w-full bg-current rounded-full ${bold ? "h-1/2" : "h-2/5"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
