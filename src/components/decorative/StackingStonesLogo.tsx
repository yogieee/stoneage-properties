"use client";

import React from "react";

interface StackingStonesLogoProps {
  className?: string;
  size?: string;
  isStacked?: boolean;
}

/**
 * Architectural emblem matching the clean, thin typography of "Stoneage":
 * - Default State: 3 clean, precise thin architectural vertical lines standing together side-by-side.
 *   - 1st line: Taller (dominant monolith)
 *   - 2nd line: Medium tall
 *   - 3rd line: Shorter
 *   Tightly clustered with minimalist spacing, echoing modern architectural elevation drawings.
 * - On Click / Stacked State: Morphs smoothly into 3 thin horizontal lines stacked on top of each other
 *   (a minimalist cairn / horizontal stack).
 */
export function StackingStonesLogo({
  className = "",
  size = "w-8 h-8",
  isStacked = false,
}: StackingStonesLogoProps) {
  // Ultra-refined easing matching architectural precision
  const lineTransition = "all 0.55s cubic-bezier(0.25, 1, 0.5, 1)";

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className} block shrink-0 overflow-visible`}
      aria-hidden="true"
    >
      {/* 
        1st Line: TALLER (Left vertical line -> Top stacked horizontal line)
        Standing: x=8, y1=4.5, y2=27.5 (height = 23px)
        Stacked:  moves to top horizontal line (y=7.5, length=15px)
      */}
      <line
        x1="8"
        y1="4.5"
        x2="8"
        y2="27.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{
          transformOrigin: "8px 16px",
          transition: lineTransition,
          transform: isStacked
            ? "translate(8px, -8.5px) rotate(90deg) scaleX(0.65)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1)",
        }}
      />

      {/* 
        2nd Line: MEDIUM TALL (Middle vertical line -> Center stacked horizontal line)
        Standing: x=16, y1=8.5, y2=27.5 (height = 19px)
        Stacked:  moves to center horizontal line (y=16, length=21px)
      */}
      <line
        x1="16"
        y1="8.5"
        x2="16"
        y2="27.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{
          transformOrigin: "16px 18px",
          transition: lineTransition,
          transform: isStacked
            ? "translate(0px, -2px) rotate(90deg) scaleX(1.1)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1)",
        }}
      />

      {/* 
        3rd Line: SHORTER (Right vertical line -> Base stacked horizontal line)
        Standing: x=24, y1=13.5, y2=27.5 (height = 14px)
        Stacked:  moves to base foundation line (y=24.5, length=26px)
      */}
      <line
        x1="24"
        y1="13.5"
        x2="24"
        y2="27.5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{
          transformOrigin: "24px 20.5px",
          transition: lineTransition,
          transform: isStacked
            ? "translate(-8px, 4px) rotate(90deg) scaleX(1.85)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1)",
        }}
      />
    </svg>
  );
}
