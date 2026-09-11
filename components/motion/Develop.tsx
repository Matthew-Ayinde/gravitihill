"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, TOGGLE_ONCE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A photograph that develops as it arrives.
 *
 * The image enters nearly monochrome, slightly lifted and zoomed, and comes
 * up to its graded colour as it reaches the reader — a print coming up in
 * the tray. On desktop it is scrubbed to the scroll, so it develops exactly
 * as fast as the reader approaches it; on phones it plays once, because
 * scrubbing a CSS filter on a full-width image every frame is paint a phone
 * should not be asked for.
 *
 * Moves `[data-develop-media]` inside its children. Reduced motion: nothing
 * is set, and the photograph is in its final grade at first paint.
 */
export function Develop({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const media = root?.querySelector<HTMLElement>("[data-develop-media]");
      if (!root || !media) return;

      const from = { scale: 1.14, filter: "grayscale(1) brightness(1.18) contrast(0.86)" };
      const to = { scale: 1, filter: "grayscale(0) brightness(1) contrast(1)" };
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(media, from, {
          ...to,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 92%", end: "center 55%", scrub: 0.6 },
        });
      });

      mm.add("(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(media, from, {
          ...to,
          duration: 1.6,
          ease: EASE_3D,
          scrollTrigger: { trigger: root, start: "top 85%", toggleActions: TOGGLE_ONCE },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
