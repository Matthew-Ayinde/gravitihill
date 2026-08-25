"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PARALLAX_RANGE } from "@/lib/motion";

/**
 * Generic scroll-linked vertical drift.
 *
 * Tracks the element's own progress through the viewport (`start end` → the
 * element's top hits the bottom of the screen, `end start` → its bottom hits
 * the top) and maps that to a small translateY. Content that scrolls with the
 * page but at a slightly different rate than its neighbours — the depth cue
 * that reads as "parallax" without ever detaching from scroll position, so
 * there's no scroll-jacking and no fighting the browser's native behaviour.
 *
 * `direction="up"` drifts the element up as the page scrolls past it (use for
 * foreground content); `"down"` drifts it down (use for background/ghost
 * elements that should lag). `range` is the fraction of the element's own
 * height it travels, end to end.
 *
 * The transform is gated on `mounted` rather than applied unconditionally:
 * `useScroll` has nothing to measure before the DOM exists, so the pre-mount
 * client render must render the exact same (static) markup as the server —
 * otherwise React flags a hydration mismatch on every page that uses this.
 */
export function Parallax({
  children,
  className,
  as = "div",
  range = PARALLAX_RANGE,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  range?: number;
  direction?: "up" | "down";
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sign = direction === "up" ? -1 : 1;
  const magnitude = range * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${sign * magnitude}%`, `${sign * -magnitude}%`],
  );

  useEffect(() => setMounted(true), []);

  const MotionTag = m[as as keyof typeof m] as typeof m.div;
  const live = mounted && !reduced;

  return (
    <MotionTag ref={ref} data-motion className={className} style={live ? { y } : undefined}>
      {children}
    </MotionTag>
  );
}
