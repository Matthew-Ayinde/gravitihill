"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getHeroReadySnapshot, subscribeHeroReady } from "@/lib/hero-gate";
import {
  DUR_LOAD,
  EASE_BRAND,
  LOAD_MASK_Y,
  LOAD_STAGGER,
  LOAD_Y,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The on-load entrance: composes the first screen of a page in reading order.
 *
 * ── Marks, not wrappers ──────────────────────────────────────────────────
 * Any descendant carrying `data-load` joins the sequence, in document order:
 *   data-load          rises and fades in
 *   data-load="mask"   wipes up out of its own box — for headlines
 *
 * The mask is one clip-path on the whole block rather than a line split.
 * SplitText would replace the text nodes React rendered, and it would measure
 * lines before the webfont settles; a single clip needs neither.
 *
 * ── No flash before hydration ────────────────────────────────────────────
 * An inline script in the root layout stamps `data-motion-boot` on <html>
 * before first paint, and CSS holds every [data-load] at opacity 0 while it
 * is there. This component takes over that hold inline in its layout effect,
 * then MotionRoot removes the attribute — so server HTML never paints, then
 * vanishes, then animates back in. A CSS failsafe reveals everything if JS
 * never arrives.
 *
 * ── Waits for the splash ─────────────────────────────────────────────────
 * On "/" the sequence holds until the splash doors part (lib/hero-gate), so
 * it plays in view rather than behind the gate. The check is deferred a frame
 * because SplashScreen re-arms the gate in its own effect, which runs after
 * this one.
 *
 * Reduced motion: nothing is held and nothing moves.
 */
export function Entrance({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds before the first item moves. */
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = ref.current;
      if (reduced || !root || !contextSafe) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-load]", root);
      if (items.length === 0) return;

      // Hold everything until the sequence is released.
      gsap.set(items, { opacity: 0 });

      const play = contextSafe(() => {
        const timeline = gsap.timeline({
          delay,
          defaults: { ease: EASE_BRAND, duration: DUR_LOAD },
        });

        items.forEach((item, i) => {
          const at = i * LOAD_STAGGER;

          if (item.dataset.load === "mask") {
            timeline.fromTo(
              item,
              { opacity: 1, y: LOAD_MASK_Y, clipPath: "inset(0% -10% 100% -10%)" },
              {
                y: 0,
                clipPath: "inset(-10% -10% -20% -10%)",
                clearProps: "transform,clipPath,opacity",
              },
              at,
            );
          } else {
            timeline.fromTo(
              item,
              { opacity: 0, y: LOAD_Y },
              { opacity: 1, y: 0, clearProps: "transform,opacity" },
              at,
            );
          }
        });
      });

      let unsubscribe: (() => void) | undefined;
      const frame = requestAnimationFrame(() => {
        if (getHeroReadySnapshot()) {
          play();
          return;
        }
        unsubscribe = subscribeHeroReady(() => {
          if (!getHeroReadySnapshot()) return;
          unsubscribe?.();
          unsubscribe = undefined;
          play();
        });
      });

      return () => {
        cancelAnimationFrame(frame);
        unsubscribe?.();
      };
    },
    { dependencies: [reduced, delay], scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
