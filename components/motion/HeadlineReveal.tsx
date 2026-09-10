"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  DUR_LINE,
  EASE_BRAND,
  SCROLL_START,
  STAGGER_LINES,
  TOGGLE_ONCE,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Line-level mask reveal: each line is clipped by overflow-hidden and its
 * inner span translates up. Lines stagger at 80ms.
 *
 * Line-level only — never per-character. GSAP ships SplitText and it is
 * tempting to point it at a headline and let it animate every glyph; that is
 * the clearest tell of a generated build and the brief bans it. Lines are
 * passed in as an array by the caller, so the break points are a typographic
 * decision made by a person, not whatever SplitText happens to measure at a
 * given viewport width — which also means they cannot re-break mid-animation
 * on resize.
 *
 * Deliberately NOT used on above-the-fold page titles. Those are the LCP
 * element, and a masked entrance withholds the paint the performance budget
 * depends on. Above the fold the headline is simply there when you arrive;
 * the page composes itself from the second section down.
 */
export function HeadlineReveal({
  lines,
  as: Tag = "h2",
  id,
  className,
  lineClassName,
}: {
  lines: ReactNode[];
  as?: ElementType;
  id?: string;
  className?: string;
  lineClassName?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;

      const inners = gsap.utils.toArray<HTMLElement>("[data-line-inner]", ref.current);
      if (inners.length === 0) return;

      gsap.fromTo(
        inners,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: DUR_LINE,
          ease: EASE_BRAND,
          stagger: STAGGER_LINES,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_START,
            toggleActions: TOGGLE_ONCE,
          },
        },
      );
    },
    { dependencies: [reduced, lines.length], scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-motion className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassName ?? ""}`}>
          <span data-line-inner className="block">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
