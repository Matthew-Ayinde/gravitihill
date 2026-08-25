"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A slow, animated film-grain texture — an SVG `feTurbulence` filter, not an
 * image or a canvas loop. This is the footer's answer to "make it stand
 * out": not a colour, a *texture that's alive*. Nothing here is a gradient,
 * a particle system, or WebGL — it's one filter primitive with its seed
 * drifting over several seconds, at an opacity low enough to read as
 * texture, not noise.
 *
 * Absolute, full-bleed, `aria-hidden`, `pointer-events-none`: a lighting
 * condition on the panel behind it, never something a reader interacts with.
 *
 * Reduced motion: the `<animate>` element is omitted entirely rather than
 * relying on the sitewide CSS reset, since SMIL animation isn't a CSS
 * animation and the blanket `animation-duration` override doesn't reach it.
 * The grain still renders — just as a fixed, non-shifting texture.
 */
export function GrainOverlay({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const filterId = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full opacity-10 mix-blend-soft-light",
        className,
      )}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="2"
          stitchTiles="stitch"
          result="noise"
        >
          {!reduced && (
            <animate
              attributeName="baseFrequency"
              values="0.85;0.9;0.82;0.85"
              dur="9s"
              repeatCount="indefinite"
            />
          )}
        </feTurbulence>
        <feColorMatrix in="noise" type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
