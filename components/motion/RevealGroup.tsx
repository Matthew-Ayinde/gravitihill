"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  DUR_REVEAL,
  EASE_BRAND,
  REVEAL_Y,
  SCROLL_START,
  STAGGER,
  TOGGLE_ONCE,
} from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Staggers direct children at 60–80ms. Pair with <RevealItem> — a bare child
 * will not animate, which is intentional: opting a child out is a no-op.
 *
 * ── One tween, not one per child ─────────────────────────────────────────
 * framer-motion propagated a "visible" variant down the tree, so every child
 * was its own animation subscribing to its own state. GSAP staggers natively:
 * the group queries its items once and animates them as a single tween with a
 * stagger, driven by a single ScrollTrigger on the group. For a 12-item grid
 * that is one trigger and one tween instead of thirteen of each.
 *
 * The query is scoped to this group's own DOM (via useGSAP's `scope`), so
 * nested RevealGroups do not steal each other's items.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = "div",
  stagger = STAGGER,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (context, contextSafe) => {
      void contextSafe;
      if (reduced || !ref.current) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", ref.current);
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: REVEAL_Y },
        {
          opacity: 1,
          y: 0,
          duration: DUR_REVEAL,
          ease: EASE_BRAND,
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: SCROLL_START,
            toggleActions: TOGGLE_ONCE,
          },
        },
      );
    },
    { dependencies: [reduced, stagger], scope: ref },
  );

  return (
    <Tag ref={ref} data-motion className={className}>
      {children}
    </Tag>
  );
}

/**
 * A group member. Renders a plain element carrying the marker attribute its
 * parent group queries for — it holds no animation of its own, which is why a
 * RevealItem outside a RevealGroup is simply a div, not a broken animation.
 */
export function RevealItem({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag data-reveal-item className={className}>
      {children}
    </Tag>
  );
}
