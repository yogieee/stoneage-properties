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

  // Extrusion vector: pushes a "back" edge up-and-right off the front
  // face so each bar reads as a solid block (front/side/top faces)
  // instead of a flat silhouette, matching the 3D monolith mark.
  const dx = 10;
  const dy = -16;

  return (
    <svg
      viewBox="66 30 192 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className} block shrink-0 overflow-visible`}
      aria-hidden="true"
      style={{ filter: "drop-shadow(2px 4px 5px rgba(28,27,25,0.25))" }}
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

        Each bar is a <g> of three faces (top / side / front) sharing
        one transform so the extruded block morphs as a unit.
      */}

      {/* 1st: TALLER (bbox x 76-115, y 40-340; center 95.5, 190) */}
      <g
        style={{
          transformOrigin: "95.5px 190px",
          transition: barTransition,
          transform: isStacked
            ? "translate(61px, -29px) rotate(90deg) scaleX(1.03) scaleY(0.47)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      >
        <path
          d={`M115,60 L${115 + dx},${60 + dy} L${115 + dx},${340 + dy} L115,340 Z`}
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path
          d={`M76,40 L115,60 L${115 + dx},${60 + dy} L${76 + dx},${40 + dy} Z`}
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path d="M76 40 L115 60 L115 340 L76 340 Z" fill="currentColor" />
      </g>

      {/* 2nd: MEDIUM TALL (bbox x 137-176, y 142-340; center 156.5, 241) */}
      <g
        style={{
          transformOrigin: "156.5px 241px",
          transition: barTransition,
          transform: isStacked
            ? "translate(0px, 0px) rotate(90deg) scaleX(1.03) scaleY(0.71)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      >
        <path
          d={`M176,162 L${176 + dx},${162 + dy} L${176 + dx},${340 + dy} L176,340 Z`}
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path
          d={`M137,142 L176,162 L${176 + dx},${162 + dy} L${137 + dx},${142 + dy} Z`}
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path d="M137 142 L176 162 L176 340 L137 340 Z" fill="currentColor" />
      </g>

      {/* 3rd: SHORTER (bbox x 198-237, y 242-340; center 217.5, 291) */}
      <g
        style={{
          transformOrigin: "217.5px 291px",
          transition: barTransition,
          transform: isStacked
            ? "translate(-61px, 30px) rotate(90deg) scaleX(1.03) scaleY(1.43)"
            : "translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1)",
        }}
      >
        <path
          d={`M237,262 L${237 + dx},${262 + dy} L${237 + dx},${340 + dy} L237,340 Z`}
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path
          d={`M198,242 L237,262 L${237 + dx},${262 + dy} L${198 + dx},${242 + dy} Z`}
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path d="M198 242 L237 262 L237 340 L198 340 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
