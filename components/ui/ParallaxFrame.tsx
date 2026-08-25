"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * The image-parallax layer used inside every <EditorialImage>.
 *
 * A single change here is how "pronounced scroll motion" reaches every photo
 * on every route — service covers, sector visuals, insight art, leadership
 * frames — without each page having to opt in individually.
 *
 * The image is rendered slightly oversized and drifts within its frame as
 * the frame crosses the viewport; the fixed overscan means the drift never
 * exposes an edge. The overlay tint in EditorialImage sits *outside* this
 * component, as a sibling, so it stays put while the photograph moves
 * underneath it.
 *
 * `useScroll`'s progress depends on the element's measured position, which
 * doesn't exist during SSR or the first client paint. The DOM shape here is
 * identical whether or not the transform is live — only the `style` value
 * changes, gated on `mounted` — so the pre-mount client render matches the
 * server render exactly and React never has to reconcile a hydration
 * mismatch. The transform simply switches on a frame after mount.
 */
export function ParallaxFrame({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => setMounted(true), []);

  const live = mounted && !reduced;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <m.div
        data-motion
        className="absolute inset-0 scale-[1.15]"
        style={live ? { y } : undefined}
      >
        {children}
      </m.div>
    </div>
  );
}
