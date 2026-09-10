"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { PARALLAX_RANGE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Generic scroll-linked vertical drift.
 *
 * Tracks the element's own progress through the viewport ("top bottom" → its
 * top hits the bottom of the screen, "bottom top" → its bottom hits the top)
 * and maps that to a small translateY. Content that scrolls with the page but
 * at a slightly different rate than its neighbours — the depth cue that reads
 * as parallax without ever detaching from scroll position, so there is no
 * scroll-jacking and no fighting the browser's native behaviour.
 *
 * `direction="up"` drifts the element up as the page scrolls past it (use for
 * foreground content); "down" drifts it down (use for background/ghost
 * elements that should lag). `range` is the fraction of the element's own
 * height it travels, end to end.
 *
 * scrub: true rather than a number — the value tracks the scrollbar exactly.
 * Lenis has already eased the scroll position by the time ScrollTrigger reads
 * it (see SmoothScroll), and adding a scrub lag on top of that eased value
 * puts a second layer of latency between the reader's input and the pixels,
 * which reads as sluggish rather than smooth.
 *
 * The pre-mount hydration dance the framer-motion version needed is gone:
 * nothing here renders differently on server and client, because the
 * transform is only ever applied by GSAP after mount.
 */
export function Parallax({
  children,
  className,
  as: Tag = "div",
  range = PARALLAX_RANGE,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  range?: number;
  direction?: "up" | "down";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      const sign = direction === "up" ? -1 : 1;
      const travel = range * 100;

      gsap.fromTo(
        ref.current,
        { yPercent: sign * travel },
        {
          yPercent: sign * -travel,
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
    { dependencies: [reduced, range, direction], scope: ref },
  );

  return (
    <Tag ref={ref} data-motion className={className}>
      {children}
    </Tag>
  );
}
