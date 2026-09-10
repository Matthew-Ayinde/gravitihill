"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MAGNETIC_FOLLOW } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps a single interactive child (a button, a link) so it leans toward the
 * cursor within a small radius and springs back on release.
 *
 * Reserved for the handful of calls-to-action that carry real weight — a hero
 * CTA, the header's "Start a conversation" — not applied blanket across every
 * link, or it stops reading as emphasis.
 *
 * ── quickTo, not a tween per pointer event ───────────────────────────────
 * gsap.quickTo builds one reusable tween per property and re-targets it on
 * each move. A pointermove handler that called gsap.to() instead would
 * allocate a new tween ~60 times a second and leave the old ones to be
 * garbage collected mid-interaction — the classic way a "smooth" cursor
 * effect becomes the thing that drops frames.
 *
 * Fine-pointer desktop only; touch and reduced motion render the child
 * completely inert (no wrapper behaviour, no listeners).
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

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = enabled && !reduced;

  useGSAP(
    () => {
      const node = ref.current;
      if (!live || !node) return;

      const moveX = gsap.quickTo(node, "x", MAGNETIC_FOLLOW);
      const moveY = gsap.quickTo(node, "y", MAGNETIC_FOLLOW);

      const onMove = (event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
        moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerleave", onLeave);
      return () => {
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [live, strength], scope: ref },
  );

  if (!live) return <span className={className}>{children}</span>;

  return (
    <span ref={ref} data-motion className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
