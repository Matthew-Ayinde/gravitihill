"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A checkerboard-square grid — pure SVG `<line>` strokes tiled through a
 * `<pattern>`, crossing at right angles into a clear square lattice rather
 * than a faint texture. No CSS gradient function anywhere, no images, no
 * WebGL. The whole grid drifts on one continuous diagonal loop via a single
 * SMIL `animateTransform` on `patternTransform` — one lightweight DOM node,
 * seamless because the travel distance is exactly one tile.
 *
 * This is the "stand out without a gradient" answer for a dark panel that
 * would otherwise be a flat colour fill: geometry and motion carry the
 * weight instead. Absolute, full-bleed, `aria-hidden`, `pointer-events-none`
 * — a surface, never content.
 *
 * Reduced motion: the `<animateTransform>` is omitted outright (SMIL isn't
 * reached by the sitewide CSS animation-duration reset), so the grid still
 * renders — just fixed.
 */
export function AnimatedGrid({
  className,
  size = 72,
  stroke = "rgba(255,255,255,0.22)",
  strokeWidth = 1.25,
  duration = 11,
}: {
  className?: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2={size} y2="0" stroke={stroke} strokeWidth={strokeWidth} />
          <line x1="0" y1="0" x2="0" y2={size} stroke={stroke} strokeWidth={strokeWidth} />
          {!reduced && (
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to={`${size} ${size}`}
              dur={`${duration}s`}
              repeatCount="indefinite"
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
