"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * THE SINGLE GSAP ENTRY POINT
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Every animated component on the site imports gsap from here, never from
 * "gsap" directly. Two reasons:
 *
 * 1. Plugin registration happens exactly once, at module evaluation, before
 *    any consumer can build a tween. Registering inside a component means a
 *    tween can be constructed before its plugin exists, and GSAP's failure
 *    mode for that is a console warning plus a silently wrong ease — not an
 *    error. Import order makes that impossible here.
 *
 * 2. The brand ease is a real curve, not an approximation. The design system's
 *    cubic-bezier(0.22, 1, 0.36, 1) is registered as a CustomEase named
 *    "brand", expressed as the equivalent SVG cubic: control points (0.22, 1)
 *    and (0.36, 1) between (0,0) and (1,1). Reaching for "power4.out" instead
 *    would be close but not the same curve, and the whole point of a token is
 *    that it is the same everywhere.
 *
 * SSR: client components still execute on the server during the RSC render.
 * ScrollTrigger and SplitText both touch document/window at registration, so
 * the guard is load-bearing, not defensive noise.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);

  // cubic-bezier(0.22, 1, 0.36, 1) — the site's one easing curve.
  CustomEase.create("brand", "M0,0 C0.22,1 0.36,1 1,1");

  // cubic-bezier(0.16, 1, 0.3, 1) — --ease-3d in globals.css. A harder stop
  // than "brand": used where something arrives with mass and settles, which
  // is every depth move in the /about studio.
  CustomEase.create("ease3d", "M0,0 C0.16,1 0.3,1 1,1");

  // Never let a tween run longer than a stutter: if the tab is throttled or
  // the main thread stalls, GSAP catches up in one frame instead of trying to
  // replay every dropped one.
  gsap.ticker.lagSmoothing(200, 33);
}

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
