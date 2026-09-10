"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Site-wide inertia scrolling, driven by GSAP's ticker.
 *
 * Lenis smooths the wheel/touch input and animates the *real* scroll position
 * every frame — it does not virtualise scroll behind a transform, so
 * window.scrollY, native anchor jumps and every ScrollTrigger on the site keep
 * working, just riding a longer, eased curve.
 *
 * ── Why one ticker and not two ───────────────────────────────────────────
 * The pre-port version ran Lenis on its own requestAnimationFrame loop. With
 * ScrollTrigger in the picture that is a bug waiting to happen: two
 * independent loops means ScrollTrigger can sample a scroll position Lenis is
 * halfway through writing, which shows up as pinned sections juddering by a
 * frame. So Lenis is driven *by* gsap.ticker (one loop, one frame, in order),
 * and ScrollTrigger.update is subscribed to Lenis's own scroll event rather
 * than left to poll.
 *
 * lagSmoothing is disabled for the duration: GSAP's default catch-up behaviour
 * fights an inertia scroller after a stalled frame, producing a visible jump.
 * (lib/gsap.ts re-arms it globally; this is the one place it must be off.)
 *
 * ── Options that keep it seamless ────────────────────────────────────────
 * anchors            in-page #links glide instead of jumping (and respect
 *                    scroll-margin, e.g. the leadership rows)
 * autoToggle         pauses while <html> is overflow-locked — the splash gate
 * allowNestedScroll  scrollable panels inside the page scroll natively
 *
 * CSS `scroll-behavior: smooth` is switched off while Lenis runs (see
 * globals.css): left on, the browser re-eases every position Lenis writes,
 * which is what makes inertia scrolling feel laggy instead of smooth.
 *
 * Renders nothing. Mounted once, in MotionRoot, so every route gets it.
 * prefers-reduced-motion skips it entirely — scrolling stays native and
 * instant, which is the whole point of that setting.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let tick: ((time: number) => void) | undefined;

    void import("lenis").then(({ default: LenisScroller }) => {
      if (cancelled) return;

      const lenis = new LenisScroller({
        lerp: 0.1,
        smoothWheel: true,
        anchors: true,
        autoToggle: true,
        allowNestedScroll: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      // gsap.ticker runs in seconds, Lenis expects milliseconds.
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(200, 33);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // By the time this runs, Next has already moved the page for the new route
  // (to the top, or back to a restored position). Snap Lenis to wherever that
  // is, so momentum left over from the previous page cannot carry the new one.
  useEffect(() => {
    lenisRef.current?.scrollTo(window.scrollY, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
