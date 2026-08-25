"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MAGNETIC_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Wraps a single interactive child (a button, a link) so it leans toward the
 * cursor within a small radius and springs back on release.
 *
 * Reserved for the handful of calls-to-action that carry real weight — a
 * hero CTA, the header's "Start a conversation" — not applied blanket across
 * every link, or it stops reading as emphasis.
 *
 * Fine-pointer desktop only; touch and reduced motion render the child
 * completely inert (no wrapper, no listeners).
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  /** 0–1. How far the element travels relative to the cursor's offset. */
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNETIC_SPRING);
  const springY = useSpring(y, MAGNETIC_SPRING);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (reduced || !enabled) {
    return <span className={className}>{children}</span>;
  }

  return (
    <m.span
      ref={ref}
      data-motion
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </m.span>
  );
}
