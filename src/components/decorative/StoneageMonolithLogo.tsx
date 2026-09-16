interface StoneageMonolithLogoProps {
  className?: string;
  size?: string;
  variant?: "full" | "mark" | "badge";
}

/**
 * Architectural Monolith Logo for Stoneage Properties.
 * Features the signature chevron/diamond geometry, vertical light shaft gradient,
 * and high-contrast typography set inside the monolith.
 */
export function StoneageMonolithLogo({
  className = "",
  size = "w-10 h-14",
  variant = "full",
}: StoneageMonolithLogoProps) {
  if (variant === "mark") {
    // Compact mark suitable for inline icons, nav emblems, and stamps:
    // a skyline of three bars set inside a ring, the tallest bar breaking through the top.
    return (
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={`${size} ${className}`}
        aria-hidden="true"
      >
        <path
          d="M34,30.3 A32,32 0 1,0 60.9,27.9"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="38,18 50,10 50,82 38,82" fill="currentColor" />
        <polygon points="52,42 62,38 62,82 52,82" fill="currentColor" />
        <polygon points="64,57 74,52 74,82 64,82" fill="currentColor" />
      </svg>
    );
  }

  // Full architectural monolith presentation with vertical gradient light shafts
  return (
    <svg
      viewBox="0 0 366 536"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className}`}
      aria-label="Stoneage Properties Monolith Logo"
    >
      <defs>
        <linearGradient
          id="stoneageLightLeft"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="25%" stopColor="#1a1a19" stopOpacity="0.4" />
          <stop offset="65%" stopColor="#8c8a84" stopOpacity="0.8" />
          <stop offset="90%" stopColor="#e8e6df" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <linearGradient
          id="stoneageLightRight"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="25%" stopColor="#141413" stopOpacity="0.3" />
          <stop offset="65%" stopColor="#76746f" stopOpacity="0.75" />
          <stop offset="90%" stopColor="#d5d3cb" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Left Light Shaft Column */}
      <polygon
        points="42,0 183,0 183,260 42,390"
        fill="url(#stoneageLightLeft)"
      />

      {/* Right Light Shaft Column */}
      <polygon
        points="183,0 324,0 324,390 183,260"
        fill="url(#stoneageLightRight)"
      />

      {/* Subtle Central Architectural Seam */}
      <line
        x1="183"
        y1="0"
        x2="183"
        y2="260"
        stroke="#111110"
        strokeWidth="1"
        strokeOpacity="0.45"
      />

      {/* Diamond Monolith Body */}
      <polygon points="183,260 314,391 183,522 52,391" fill="#000000" />

      {/* High-Contrast STONE / AGE Typography rotated 45° like reference */}
      <g transform="translate(183, 391) rotate(-45)">
        <text
          x="0"
          y="-30"
          fill="#ffffff"
          fontFamily="var(--font-mono, monospace)"
          fontWeight="900"
          fontSize="50"
          letterSpacing="-1"
          textAnchor="middle"
          dominantBaseline="central"
        >
          STONE
        </text>
        <line
          x1="-65"
          y1="2"
          x2="65"
          y2="2"
          stroke="#ffffff"
          strokeWidth="3"
          strokeOpacity="0.8"
        />
        <text
          x="0"
          y="36"
          fill="#ffffff"
          fontFamily="var(--font-mono, monospace)"
          fontWeight="900"
          fontSize="52"
          letterSpacing="8"
          textAnchor="middle"
          dominantBaseline="central"
        >
          AGE
        </text>
      </g>
    </svg>
  );
}
