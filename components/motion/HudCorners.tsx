"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
  const ref = useRef<HTMLDivElement>(null);
  const stroke = tone === "dark" ? "var(--accent)" : "var(--green)";

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      const paths = gsap.utils.toArray<SVGPathElement>("path", ref.current);
      if (paths.length === 0) return;

      // The stroke draws itself by walking its own dash offset from "one full
      // path length away" to zero. framer-motion exposed this as pathLength;
      // in GSAP it is the underlying SVG mechanic, measured per path so the
      // brackets draw at the same rate regardless of the `size` prop.
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length, opacity: 0 },
          {
            strokeDashoffset: 0,
            opacity: 0.7,
            duration: 0.7,
            delay: i * 0.08,
            ease: EASE_BRAND,
            scrollTrigger: {
              trigger: ref.current,
              start: SCROLL_START,
              toggleActions: TOGGLE_ONCE,
            },
          },
        );
      });
    },
    { dependencies: [reduced, size, tone], scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {CORNERS.map((position, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 30 30"
          className={cn("absolute", position, reduced && "opacity-70")}
        >
          <path d="M1 21V1H21" fill="none" stroke={stroke} strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}
