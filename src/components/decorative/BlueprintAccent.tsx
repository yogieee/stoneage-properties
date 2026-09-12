type BlueprintAccentProps = {
  className?: string;
};

/**
 * Content-agnostic decorative accent: an inline-SVG architectural
 * blueprint/floor-plan line-art motif (dimension lines, a center
 * crosshair, and rectilinear "floor-plan" outlines).
 *
 * Purely ambient brand texture, not content:
 * - `stroke="currentColor"` only, no fill — always inherits the parent's
 *   semantic `text-*` token color, never a hardcoded hex.
 * - `aria-hidden="true"` — excluded from the accessibility tree entirely.
 * - No domain props, no text — stays as content-agnostic as
 *   `components/motion/` primitives.
 * - Positioning/sizing/opacity is the *consumer's* responsibility via
 *   `className`; this component only returns the raw `<svg>`.
 */
export function BlueprintAccent({ className }: BlueprintAccentProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer floor-plan outline */}
      <rect x="40" y="40" width="320" height="320" />
      {/* Inner room partition */}
      <rect x="40" y="220" width="180" height="140" />
      <line x1="220" y1="220" x2="220" y2="360" />
      <line x1="40" y1="220" x2="360" y2="220" />

      {/* Dimension lines along the top edge */}
      <line x1="40" y1="20" x2="360" y2="20" />
      <line x1="40" y1="14" x2="40" y2="26" />
      <line x1="360" y1="14" x2="360" y2="26" />
      <line x1="200" y1="14" x2="200" y2="26" />

      {/* Dimension lines along the left edge */}
      <line x1="20" y1="40" x2="20" y2="360" />
      <line x1="14" y1="40" x2="26" y2="40" />
      <line x1="14" y1="360" x2="26" y2="360" />
      <line x1="14" y1="200" x2="26" y2="200" />

      {/* Center crosshair / datum mark */}
      <line x1="280" y1="100" x2="280" y2="140" />
      <line x1="260" y1="120" x2="300" y2="120" />
      <circle cx="280" cy="120" r="20" />
    </svg>
  );
}
