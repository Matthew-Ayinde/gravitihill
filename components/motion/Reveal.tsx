"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  DUR_REVEAL,
  EASE_BRAND,
  REVEAL_Y,
  SCROLL_START,
  TOGGLE_ONCE,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds. Use sparingly — prefer RevealGroup for sequences. */
  delay?: number;
};

/**
 * The baseline scroll reveal: opacity 0→1, y 16→0, 600ms, fires once.
 *
 * ── A property the framer-motion version did not have ────────────────────
 * The markup ships visible. framer-motion rendered `opacity: 0` into the
 * server HTML and undid it on hydration, which meant every revealed block on
 * the site was invisible to a crawler that does not execute JS, and flashed
 * blank if hydration was slow. Here the element is painted normally and
 * gsap.set hides it inside useGSAP — which runs on useLayoutEffect, before
 * the browser paints — so there is no flash, and no-JS/crawler renders get
 * the finished page.
 *
 * Under prefers-reduced-motion nothing is set up at all: content is in its
 * final state on first paint.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: REVEAL_Y },
        {
          opacity: 1,
          y: 0,
          duration: DUR_REVEAL,
          delay,
          ease: EASE_BRAND,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_START,
            toggleActions: TOGGLE_ONCE,
          },
        },
      );
    },
    { dependencies: [reduced, delay], scope: ref },
  );

  return (
    <Tag ref={ref} data-motion className={className}>
      {children}
    </Tag>
  );
}
