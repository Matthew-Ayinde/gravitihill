"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND } from "@/lib/motion";
import { cn, wordTokens } from "@/lib/utils";

/**
 * An article title that comes into focus.
 *
 * Each word rises a short way out of a soft blur and sharpens in reading
 * order — a focus pull rather than a wipe. It suits a page whose whole job
 * is to be read: the first thing the reader's eye does is settle on the
 * title, and the title settles with it.
 *
 * Word-level, never per character. The words are aria-hidden behind one
 * sr-only copy. `data-hold` keeps them out of the pre-hydration paint (see
 * globals.css); reduced motion shows the finished title at first paint.
 */
export function FocusTitle({
  text,
  id,
  className,
}: {
  text: string;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-focus-word]", root);
      if (words.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          words,
          { opacity: 0, yPercent: 38, filter: "blur(14px)" },
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.25,
            delay: 0.25,
            stagger: 0.045,
            ease: EASE_BRAND,
            clearProps: "filter,transform",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} id={id} className={cn("type-display", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-hold>
        {wordTokens(text).map((token, i) =>
          /^\s+$/.test(token) ? (
            token
          ) : (
            <span key={i} data-focus-word data-motion className="inline-block">
              {token}
            </span>
          ),
        )}
      </span>
    </h1>
  );
}
