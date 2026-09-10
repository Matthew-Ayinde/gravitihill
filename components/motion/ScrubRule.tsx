"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * A 1px vertical rule that fills with --accent as the reader scrolls through
 * the nearest ancestor marked `data-scrub-root` — a reading-progress mark for
 * one block, not for the page.
 *
 * Scrubbed, so it tracks the scrollbar exactly and reverses with it. Desktop
 * only: under 1024px the block it measures is not sticky, so progress through
 * it means nothing. Reduced motion renders the rule already full (the
 * `data-motion` guard in globals.css forces the final transform).
 */
export function ScrubRule({ className }: { className?: string }) {
  const track = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = fill.current;
      const root = track.current?.closest<HTMLElement>("[data-scrub-root]");
      if (!node || !root) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          node,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 65%", end: "bottom 65%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: track },
  );

  return (
    <span ref={track} aria-hidden="true" className={cn("block w-px bg-rule", className)}>
      <span ref={fill} data-motion className="block h-full w-full origin-top bg-accent" />
    </span>
  );
}
