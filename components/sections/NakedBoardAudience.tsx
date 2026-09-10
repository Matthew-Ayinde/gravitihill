"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn, indexNumber } from "@/lib/utils";

/**
 * The "who it's for" list, reworked from a plain hairline-ruled list into
 * rows that answer touch/hover with a light sweep — a single soft band of
 * `--green` at low opacity crossing the row, never a gradient on text and
 * never a shadow. The index numeral and the row's own underline both light
 * up with it, so the three read as one response rather than three separate
 * hover states competing for attention.
 */
export function NakedBoardAudience({ items }: { items: string[] }) {
  const reduced = useReducedMotion();

  return (
    <ul className="mt-14 border-t border-rule">
      {items.map((item, i) => (
        <Row key={item} index={i} reduced={!!reduced}>
          {item}
        </Row>
      ))}
    </ul>
  );
}

function Row({
  index,
  children,
  reduced,
}: {
  index: number;
  children: string;
  reduced: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const sweep = useRef<HTMLSpanElement>(null);

  // The sweep parks off-canvas on mount and animates only on a real hover.
  // The resting offset is set by GSAP rather than a Tailwind translate class
  // on purpose: Tailwind v4 writes the standalone `translate` property while
  // GSAP writes `transform`, so a class-set offset would stack on top of the
  // tween's instead of being replaced by it — the band would start a full
  // extra width to the left and never line up.
  const first = useRef(true);

  useGSAP(
    () => {
      if (reduced || !sweep.current) return;

      if (first.current) {
        first.current = false;
        gsap.set(sweep.current, { xPercent: -140 });
        return;
      }

      gsap.to(sweep.current, {
        xPercent: hovered ? 620 : -140,
        duration: 0.85,
        ease: EASE_BRAND,
      });
    },
    { dependencies: [hovered, reduced], scope: ref },
  );

  return (
    <li
      ref={ref}
      className="group relative flex gap-6 overflow-hidden border-b border-rule py-7"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {!reduced && (
        <span
          ref={sweep}
          data-motion
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-green/[0.05]"
        />
      )}

      <span
        className={cn(
          "type-eyebrow relative w-8 shrink-0 pt-1 transition-colors duration-300",
          hovered ? "text-accent" : "text-green",
        )}
      >
        {indexNumber(index)}
      </span>

      <p className="measure relative text-body-lg">{children}</p>

      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 h-px bg-green transition-all duration-500 ease-brand",
          hovered ? "w-full" : "w-0",
        )}
      />
    </li>
  );
}
