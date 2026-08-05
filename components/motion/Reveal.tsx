"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { REVEAL_TRANSITION, VIEWPORT, revealVariants } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds. Use sparingly — prefer RevealGroup for sequences. */
  delay?: number;
};

/**
 * The baseline scroll reveal: opacity 0→1, y 16→0, 600ms, fires once.
 *
 * Under prefers-reduced-motion this renders the plain element with no motion
 * wrapper at all — content is in its final state on first paint.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) return <Tag className={className}>{children}</Tag>;

  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      data-motion
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={revealVariants}
      transition={{ ...REVEAL_TRANSITION, delay }}
    >
      {children}
    </MotionTag>
  );
}
