"use client";

import { m, useReducedMotion } from "framer-motion";
import { VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CORNERS = [
  "top-0 left-0",
  "top-0 right-0 -scale-x-100",
  "bottom-0 left-0 -scale-y-100",
  "bottom-0 right-0 -scale-x-100 -scale-y-100",
] as const;

/**
 * Four corner brackets that draw themselves in on scroll — instrumentation
 * framing for a panel, not a card. Pure stroke geometry: no fill, no shadow,
 * no backdrop-blur. Drop inside any `relative` container; it fills that
 * container edge-to-edge and never intercepts a click (`pointer-events-none`).
 *
 * Reduced motion renders the finished brackets with no draw-in.
 */
export function HudCorners({
  size = 30,
  tone = "dark",
  className,
}: {
  size?: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const stroke = tone === "dark" ? "var(--accent)" : "var(--green)";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {CORNERS.map((position, i) =>
        reduced ? (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 30 30"
            className={cn("absolute opacity-70", position)}
          >
            <path d="M1 21V1H21" fill="none" stroke={stroke} strokeWidth="1.5" />
          </svg>
        ) : (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 30 30"
            className={cn("absolute", position)}
          >
            <m.path
              data-motion
              d="M1 21V1H21"
              fill="none"
              stroke={stroke}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            />
          </svg>
        ),
      )}
    </div>
  );
}
