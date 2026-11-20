"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR_BIG, DUR_REVEAL, EASE_BRAND, REVEAL_Y, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Seconds between one pillar-and-paragraph pair and the next. */
const STEP = 0.45;

/**
 * Raises the /about §02 pillars one at a time — tallest, middle, shortest —
 * and brings in each pillar's paragraph alongside it, so the drawing and the
 * text arrive as pairs.
 *
 * One ScrollTrigger and one timeline drive both columns. Pairing is by index:
 * `data-pillar="0"` rises with `data-pillar-copy="0"`, and so on. A pillar
 * grows up from the floor (scaleY from its base); its paragraph does the
 * baseline fade-and-rise. If a real render replaces the CSS pillars, there is
 * nothing to raise and the paragraphs keep the same timing.
 *
 * The markup ships visible; gsap hides it before first paint. Reduced motion
 * sets nothing up, so the finished composition renders immediately.
 */
export function PillarSequence({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (reduced || !root) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: SCROLL_START, toggleActions: TOGGLE_ONCE },
      });

      for (let i = 0; i < 3; i++) {
        const at = i * STEP;
        const pillar = root.querySelector<HTMLElement>(`[data-pillar="${i}"]`);
        const copy = root.querySelector<HTMLElement>(`[data-pillar-copy="${i}"]`);
        if (pillar) {
          tl.fromTo(
            pillar,
            { scaleY: 0, opacity: 0, transformOrigin: "50% 100%" },
            { scaleY: 1, opacity: 1, duration: DUR_BIG, ease: EASE_BRAND },
            at,
          );
        }
        if (copy) {
          tl.fromTo(
            copy,
            { opacity: 0, y: REVEAL_Y },
            { opacity: 1, y: 0, duration: DUR_REVEAL, ease: EASE_BRAND },
            at + 0.15,
          );
        }
      }
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} data-motion className={className}>
      {children}
    </div>
  );
}
