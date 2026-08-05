"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { VIEWPORT, revealVariants, staggerVariants } from "@/lib/motion";

/**
 * Staggers direct children at 60–80ms. Pair with <RevealItem> — a bare child
 * will not animate, which is intentional: opting a child out is a no-op.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
}) {
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
      variants={staggerVariants(stagger)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) return <Tag className={className}>{children}</Tag>;

  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  return (
    <MotionTag data-motion className={className} variants={revealVariants}>
      {children}
    </MotionTag>
  );
}
