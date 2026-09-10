"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { HeadlineSegment } from "@/components/motion/PressureHeadline";
import { cn, wordTokens } from "@/lib/utils";

/**
 * A statement that inks in as it is read.
 *
 * Every word starts as a faint impression and takes full ink in reading order,
 * scrubbed to the scrollbar — scroll back and it lifts off again. It is tied
 * to position rather than time, so the sentence is only ever as finished as
 * the reader's progress through it.
 *
 * Word-level only. The visible words are aria-hidden behind one sr-only copy,
 * and under reduced motion nothing is set: the statement is in full ink at
 * first paint (the `data-motion` guard in globals.css backs that up).
 */
export function InkScrub({
  segments,
  as: Tag = "p",
  id,
  className,
}: {
  segments: HeadlineSegment[];
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const label = segments.map((segment) => segment.text).join("").trim();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-ink]", root);
      if (words.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: "top 82%", end: "bottom 45%", scrub: 0.4 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) =>
          wordTokens(segment.text).map((token, tokenIndex) =>
            /^\s+$/.test(token) ? (
              token
            ) : (
              <span
                key={`${segmentIndex}-${tokenIndex}`}
                data-ink
                data-motion
                className={cn("inline-block", segment.className)}
              >
                {token}
              </span>
            ),
          ),
        )}
      </span>
    </Tag>
  );
}
