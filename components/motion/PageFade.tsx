"use client";

import { m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { pageTransition } from "@/lib/motion";

/**
 * The site's one page transition: the incoming page settles forward out of
 * a slight backward tilt, rather than a flat rise.
 *
 * `<main>` carries the `perspective-scene` context but never transforms
 * itself — the animated element is the div *inside* it. That keeps the
 * perspective's containing-block effect scoped to main's own children, so it
 * never reaches the fixed header or the mobile nav overlay, which are main's
 * siblings, not its descendants.
 *
 * Fade-in only, keyed on pathname. An exit animation would require holding the
 * outgoing RSC tree, which trades a real jank risk for a transition nobody
 * asked for.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <main id="main" className="flex-1">
        {children}
      </main>
    );
  }

  return (
    <main id="main" className="perspective-scene flex-1">
      <m.div
        data-motion
        key={pathname}
        initial={{ opacity: 0, rotateX: -5, y: 26 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={pageTransition}
        style={{ transformOrigin: "top center" }}
      >
        {children}
      </m.div>
    </main>
  );
}
