"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Counts a whole number up from 0 to `value` once it scrolls into view.
 *
 * Same rAF-schedule approach as TypedHeadline — a duration walked with
 * requestAnimationFrame and eased, rather than chained timeouts, so the
 * count can't drift or stutter under load. Digits render `tabular-nums` so
 * the surrounding layout never reflows mid-count.
 *
 * Reduced motion renders the finished number immediately — no counting.
 */
export function CountUp({
  value,
  duration = 1.1,
  pad = 0,
  className,
}: {
  value: number;
  /** Seconds. */
  duration?: number;
  /** Zero-pad the displayed number to this many digits — `pad={2}` → "05". */
  pad?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !inView) return;

    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      start ||= now;
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView, duration, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {String(display).padStart(pad, "0")}
    </span>
  );
}
