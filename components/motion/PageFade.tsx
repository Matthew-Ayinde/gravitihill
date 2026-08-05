"use client";

import { m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { pageTransition } from "@/lib/motion";

/**
 * The site's one page transition: a 240ms crossfade on route change.
 *
 * The brief offered a --ridge wipe as the alternative. A full-screen wipe is a
 * second attention-grabbing effect, and boldness is spent once — on the pinned
 * Sectors panel. So: crossfade, everywhere, no exceptions.
 *
 * Fade-in only, keyed on pathname. An exit animation would require holding the
 * outgoing RSC tree, which trades a real jank risk for 240ms nobody asked for.
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
    <m.main
      data-motion
      id="main"
      key={pathname}
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={pageTransition}
    >
      {children}
    </m.main>
  );
}
