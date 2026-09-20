import React from "react";
import { StackingStonesLogo } from "./StackingStonesLogo";

interface LogoSpinnerProps {
  className?: string;
  size?: string;
  spin?: "continuous" | "hover" | "none";
}

/**
 * Replaces the former spinning segmented circle with the new official
 * Stoneage identity mark (3 standing thin lines / stacking stones).
 * Fully backwards-compatible with all existing places that imported LogoSpinner.
 */
export function LogoSpinner({
  className = "",
  size = "h-6 w-6",
  spin = "none",
}: LogoSpinnerProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center ${size} ${className}`}
      aria-hidden="true"
    >
      <StackingStonesLogo
        size="w-full h-full"
        className={
          spin === "hover"
            ? "transition-transform duration-300 group-hover:scale-110"
            : ""
        }
      />
    </div>
  );
}
