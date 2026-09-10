"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Replaces framer-motion's useInView() for the handful of components that
 * need "has this scrolled into view yet" as React state rather than as an
 * animation.
 *
 * ScrollTrigger could do this, but a trigger carries scroll-position
 * bookkeeping and a refresh lifecycle that a one-shot boolean does not need —
 * IntersectionObserver is the cheaper, more direct tool, and it disconnects
 * itself the moment it fires.
 */
export function useInView(
  ref: RefObject<Element | null>,
  // `once` defaults to false to match the contract callers were written
  // against — NakedBoardStages relies on the boolean toggling back off as a
  // row leaves the middle of the viewport, which is how the rail's
  // "you are here" lighting works at all.
  { once = false, margin = "-10%" }: { once?: boolean; margin?: string } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, once, margin]);

  return inView;
}
