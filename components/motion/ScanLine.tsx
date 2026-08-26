"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A single hairline that sweeps down a panel on a slow loop — an
 * instrumentation cue ("this is a live system"), not a spotlight and not a
 * progress bar. Same technique as GrainOverlay/AnimatedGrid: one SVG rect
 * animated by SMIL rather than a per-frame JS transform, so once it mounts it
 * costs nothing on the main thread.
 *
 * Scoped to the secondary routes' ambient system layer — never imported by
 * the home route or The Naked Board.
 *
 * Reduced motion: the <animate> element is omitted outright (SMIL isn't
 * reached by the sitewide CSS animation-duration reset), so the line still
 * renders — just parked at rest, not sweeping.
 */
export function ScanLine({
  className,
  tone = "dark",
  duration = 6,
}: {
  className?: string;
  tone?: "dark" | "light";
  /** Seconds for one full down-and-back sweep. */
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const gradientId = useId();
  const stroke = tone === "dark" ? "var(--accent)" : "var(--green)";

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={stroke} stopOpacity="0" />
          <stop offset="50%" stopColor={stroke} stopOpacity="0.55" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="1.5" fill={`url(#${gradientId})`} y="40%">
        {!reduced && (
          <animate
            attributeName="y"
            values="-2%;100%;-2%"
            dur={`${duration}s`}
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.22 1 0.36 1;0.22 1 0.36 1"
            repeatCount="indefinite"
          />
        )}
      </rect>
    </svg>
  );
}
