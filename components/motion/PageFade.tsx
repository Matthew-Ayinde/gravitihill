"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR_PAGE, EASE_BRAND } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The site's one page transition: the incoming page settles forward out of a
 * slight backward tilt, rather than a flat rise.
 *
 * `<main>` carries the perspective-scene context but never transforms itself —
 * the animated element is the div *inside* it. That keeps the perspective's
 * containing-block effect scoped to main's own children, so it never reaches
 * the fixed header or the mobile nav overlay, which are main's siblings.
 *
 * Fade-in only, re-run on pathname change (useGSAP's dependency array is what
 * keys it, replacing framer-motion's `key`). An exit animation would require
 * holding the outgoing RSC tree, which trades a real jank risk for a
 * transition nobody asked for.
 *
 * clearProps on completion matters more here than anywhere else on the site:
 * this wrapper contains every page, and leaving a transform on it would make
 * it the containing block for any position: fixed descendant — quietly
 * breaking sticky/fixed behaviour on every route. Once the transition is
 * done, the element goes back to having no transform at all.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The route this wrapper last settled on. The first load is composed by
  // <Entrance> in the header and each page's hero, so the transition plays
  // only on a real route change — never on the initial load, and never twice
  // for the same path (Strict Mode's remount, or a reduced-motion re-run).
  const settledPath = useRef<string | null>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      const previous = settledPath.current;
      settledPath.current = pathname;
      if (previous === null || previous === pathname) return;

      gsap.fromTo(
        ref.current,
        { opacity: 0, rotateX: -5, y: 26 },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: DUR_PAGE,
          ease: EASE_BRAND,
          clearProps: "transform,opacity",
        },
      );
    },
    { dependencies: [pathname, reduced], scope: ref },
  );

  return (
    <main id="main" className="perspective-scene flex-1">
      <div ref={ref} data-motion style={{ transformOrigin: "top center" }}>
        {children}
      </div>
    </main>
  );
}
