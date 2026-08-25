"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * An infinite horizontal ribbon of short, decorative labels — practice
 * names, sector names, the market. Ambient texture, not navigation: the same
 * content is always reachable elsewhere on the page (the nav, PracticeList,
 * the footer), so this strip is `aria-hidden`.
 *
 * Pure CSS animation (`@keyframes marquee` in globals.css) rather than a
 * per-frame transform, so it costs nothing on the main thread. The content
 * is duplicated once and the track translates exactly -50%, which is why an
 * odd number of items still loops seamlessly.
 *
 * Reduced motion: renders as a static, wrapped row. Nothing moves.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  speed = 34,
  separator = "—",
  tilt = false,
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  separator?: ReactNode;
  /** Sets the ribbon back on a receding 3D plane instead of a flat strip. */
  tilt?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} aria-hidden="true">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {items.map((item, i) => (
            <span key={i} className={itemClassName}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const track = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className={cn("flex items-center", itemClassName)}>
          {item}
          <span aria-hidden="true" className="mx-8 opacity-40">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("overflow-hidden", tilt && "perspective-scene", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex w-max motion-safe:animate-marquee",
          tilt && "transform-[rotateX(9deg)]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
