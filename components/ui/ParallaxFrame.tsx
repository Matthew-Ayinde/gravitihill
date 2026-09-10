"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The image-parallax layer used inside every <EditorialImage>.
 *
 * A single change here is how "pronounced scroll motion" reaches every photo
 * on every route — service covers, sector visuals, insight art, leadership
 * frames — without each page having to opt in individually.
 *
 * The image is rendered slightly oversized (scale 1.15) and drifts within its
 * frame as the frame crosses the viewport; the fixed overscan means the drift
 * never exposes an edge.
 *
 * The overlay tint in EditorialImage sits *outside* this component, as a
 * sibling, so it stays put while the photograph moves underneath it.
 *
 * The mounted-flag hydration dance the framer-motion version needed is gone:
 * server and client render identical markup, and GSAP only ever touches the
 * element after mount, inside useGSAP.
 */
export function ParallaxFrame({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current || !inner.current) return;

      gsap.fromTo(
        inner.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div ref={inner} data-motion className="absolute inset-0 scale-[1.15]">
        {children}
      </div>
    </div>
  );
}
