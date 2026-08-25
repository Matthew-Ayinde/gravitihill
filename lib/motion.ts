import type { Transition, Variants } from "framer-motion";

/**
 * The whole motion vocabulary of the site, in one file.
 *
 * Motion here is *considered*, not expressive — the page should read as being
 * composed, not as performing. Two moments are allowed to be noticed: the
 * pinned Sectors panel and the cursor-following preview on editorial rows.
 * Everything else is this file.
 */

export const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

export const REVEAL_TRANSITION: Transition = {
  duration: 0.6,
  ease: EASE_BRAND,
};

/** Scroll reveal: opacity 0→1, y 16→0. Fires once. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};

/** Children stagger at 60–80ms. */
export const staggerVariants = (stagger = 0.07): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

/**
 * Line-level mask reveal for headlines. The line is clipped by overflow-hidden
 * and the inner span translates up.
 *
 * Line-level only. Per-character splitting is the clearest tell of a generated
 * build and is banned by the brief.
 */
export const lineMaskVariants: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.7, ease: EASE_BRAND } },
};

/** Shared viewport config so every reveal on the site triggers identically. */
export const VIEWPORT = { once: true, margin: "-12%" } as const;

/** The page transition: a settle-in fade+rise on route change. */
export const pageTransition: Transition = {
  duration: 0.5,
  ease: EASE_BRAND,
};

/**
 * ── Pronounced motion layer ──────────────────────────────────────────────
 * Parallax, magnetism and ambient scroll depth, used throughout the site
 * (not just one signature moment). Kept in this file so every component
 * reads timing and easing from one place rather than inventing its own.
 */

/** Larger entrance for hero-weight moments: more travel, a touch of scale. */
export const bigRevealVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_BRAND },
  },
};

/** Spring feel for cursor-attracted ("magnetic") elements. */
export const MAGNETIC_SPRING = { stiffness: 150, damping: 15, mass: 0.15 } as const;

/** Damped spring for trailing/cursor-follow elements. */
export const TRAIL_SPRING = { stiffness: 120, damping: 24 } as const;

/** Default vertical travel range for the <Parallax> wrapper, as a fraction
 *  of the element's own height. 0.15 reads clearly without ever detaching
 *  content from the rhythm of the scroll. */
export const PARALLAX_RANGE = 0.15;
