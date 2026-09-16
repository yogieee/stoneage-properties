interface LogoSpinnerProps {
  className?: string;
  size?: string;
  /**
   * "continuous" spins forever (main logo), "hover" spins once on group-hover
   * (buttons/links), "none" stays static (decorative notes/footer marks).
   */
  spin?: "continuous" | "hover" | "none";
}

const SEGMENTS = 8;

const SPIN_CLASSES: Record<NonNullable<LogoSpinnerProps["spin"]>, string> = {
  continuous: "animate-[spin_25s_linear_infinite]",
  hover: "transition-transform duration-700 ease-out group-hover:rotate-360",
  none: "",
};

/**
 * Small 3D-tilted ring of segments, matching the shape/gaps/tilt of the
 * intro-logo-spinner card wheel (rotate3d(0.27, -1.005, 1.5, 85deg)) at icon scale.
 */
export function LogoSpinner({ className = "", size = "h-9 w-9", spin = "none" }: LogoSpinnerProps) {
  return (
    <div className={`relative shrink-0 ${size} ${className}`} style={{ perspective: "60px" }} aria-hidden="true">
      <div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={{ transform: "rotate3d(0.27, -1.005, 1.5, 85deg)" }}
      >
        <div className={`relative h-full w-full [transform-style:preserve-3d] ${SPIN_CLASSES[spin]}`}>
          {Array.from({ length: SEGMENTS }).map((_, idx) => {
            const angle = (idx * 360) / SEGMENTS;
            return (
              <div key={idx} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                <div
                  className="bg-current absolute left-1/2 -translate-x-1/2 rounded-[1px]"
                  style={{ width: "24%", height: "18%", bottom: "76%" }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
