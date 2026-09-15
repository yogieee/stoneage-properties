interface StarIconProps {
  className?: string;
  size?: string;
  bold?: boolean;
}

export function StarIcon({ className = "", size = "w-4 h-4", bold = false }: StarIconProps) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${size} ${className}`} aria-hidden="true">
      <div className="relative w-full h-full group-hover:rotate-90 transition-transform duration-500 ease-out">
        <svg viewBox="0 0 40 100" className="w-full h-full" fill="currentColor">
          <polygon points={bold ? "2,0 40,0 2,50" : "4,0 40,0 4,46"} />
          <polygon points={bold ? "24,46 2,100 40,100" : "28,50 4,100 40,100"} />
        </svg>
      </div>
    </div>
  );
}
