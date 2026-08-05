"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { VIEWPORT, lineMaskVariants, staggerVariants } from "@/lib/motion";

/**
 * Line-level mask reveal: each line is clipped by overflow-hidden and its inner
 * span translates up. Lines stagger at 80ms.
 *
 * Line-level only — never per-character. Per-character splitting is the
 * clearest tell of a generated build.
 *
 * Deliberately NOT used on above-the-fold page titles. Those are the LCP
 * element, and a masked entrance withholds the paint that the whole
 * performance budget depends on. Above the fold the headline is simply there
 * when you arrive; the page composes itself from the second section down.
 */
export function HeadlineReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={lineClassName ?? "block"}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const MotionTag = m[as as keyof typeof m] as typeof m.h2;

  return (
    <MotionTag
      data-motion
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants(0.08)}
    >
      {lines.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassName ?? ""}`}>
          <m.span data-motion className="block" variants={lineMaskVariants}>
            {line}
          </m.span>
        </span>
      ))}
    </MotionTag>
  );
}
