"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A headline whose lines arrive from opposite sides and meet on one left
 * edge, scrubbed to the scrollbar.
 *
 * Built for home §02 ("staffed from one bench"): the lines start out of
 * register and are only aligned once the reader reaches the section, so the
 * composition itself makes the point. Odd lines travel in from the left, even
 * lines from the right, and the offset is a share of each line's own width so
 * it reads the same at every clamp() step.
 *
 * No fade and no mask: the words are legible throughout, and only their
 * register changes. Reduced motion sets nothing and the `data-motion` guard in
 * globals.css forces the aligned state.
 */
export function Converge({
  lines,
  as: Tag = "h2",
  id,
  className,
}: {
  lines: ReactNode[];
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-converge]", root);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 === 0 ? -14 : 22 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 95%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-converge data-motion className="block w-fit">
          {line}
        </span>
      ))}
    </Tag>
  );
}
