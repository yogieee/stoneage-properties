"use client";

import React from "react";

interface StackingStonesLogoProps {
  className?: string;
  size?: string;
  isStacked?: boolean;
}

/**
 * Architectural emblem matching the brand mark (three solid buildings, sharp
 * slanted tops, flat bottoms sitting on a shared ground line — no ring):
 * tallest to shortest, left to right.
 * - Default State: 3 solid architectural forms standing together side-by-side.
 *   - 1st: Taller (dominant monolith)
 *   - 2nd: Medium tall
 *   - 3rd: Shorter
 * - On Click / Stacked State: Morphs into 3 forms stacked on top of each other
 *   (a minimalist cairn / horizontal stack).
 */
export function StackingStonesLogo({
  className = "",
  size = "w-8 h-8",
  isStacked = false,
}: StackingStonesLogoProps) {
  // Ultra-refined easing matching architectural precision
  const barTransition = "all 1.6s cubic-bezier(0.25, 1, 0.5, 1)";

  return (
    <svg
      viewBox="66 30 159 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className} block shrink-0 overflow-visible`}
      aria-hidden="true"
    >
      {/*
        Stacked state target: all three bars become equal-length,
        equal-thickness horizontal lines, evenly spaced (40 gap) and
        centered on the same x-axis, sized to match the footprint of
        the closed logo (~140 wide, ~40 thick bars — the original bar
        width). Each bar starts a different height (300 / 198 / 98),
        so scaleY normalizes length and scaleX normalizes thickness —
        scaleX alone (the old approach) only affects thickness
        post-rotation, not length, which is why the open-state lines
        used to come out mismatched and noticeably smaller overall.
      */}

      {/* 1st: TALLER (bbox x 76-115, y 40-340; center 95.5, 190) */}
      <path
        d="M76 40 L115 60 L115 340 L76 340 Z"
        fill="currentColor"
        style={{
          transformOrigin: "95.5px 190px",
          transition: barTransition,
          transform: isStacked
            ? "translate(50px, -29px) rotate(90deg) scaleX(1.03) scaleY(0.47)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      />

      {/* 2nd: MEDIUM TALL (bbox x 126-165, y 142-340; center 145.5, 241) */}
      <path
        d="M126 142 L165 162 L165 340 L126 340 Z"
        fill="currentColor"
        style={{
          transformOrigin: "145.5px 241px",
          transition: barTransition,
          transform: isStacked
            ? "translate(0px, 0px) rotate(90deg) scaleX(1.03) scaleY(0.71)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      />

      {/* 3rd: SHORTER (bbox x 176-215, y 242-340; center 195.5, 291) */}
      <path
        d="M176 242 L215 262 L215 340 L176 340 Z"
        fill="currentColor"
        style={{
          transformOrigin: "195.5px 291px",
          transition: barTransition,
          transform: isStacked
            ? "translate(-50px, 30px) rotate(90deg) scaleX(1.03) scaleY(1.43)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      />
    </svg>
  );
}
