"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Site-wide inertia scrolling.
 *
 * Lenis smooths the wheel/touch input and animates the *real* scroll
 * position every frame — it does not virtualise scroll behind a transform,
 * so `window.scrollY`, native anchor jumps, and every `useScroll`/`whileInView`
 * hook already on the site (Reveal, the Sectors panel, ParallaxFrame) keep
 * working exactly as before, just riding a longer, eased curve.
 *
 * Renders nothing. Mounted once, in MotionRoot, so every route gets it.
 * `prefers-reduced-motion` skips it entirely — scrolling stays native and
 * instant, which is the whole point of that setting.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let raf = 0;
    let cancelled = false;
    let lenis: { raf: (t: number) => void; destroy: () => void } | undefined;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });

      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduced]);

  return null;
}
