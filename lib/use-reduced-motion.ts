"use client";

import { useEffect, useState } from "react";

/**
 * Replaces framer-motion's useReducedMotion() with the same contract, so the
 * ~20 components that branch on it did not have to change shape during the
 * GSAP port.
 *
 * Returns false on the server and on the first client render, then flips if
 * the user has asked for reduced motion. That initial false is deliberate:
 * every component using this renders its *static* markup regardless, and only
 * the animation is conditional — so a first-paint mismatch would be a
 * hydration error, not a visual one. Animations are set up in useGSAP, which
 * runs after this settles.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
