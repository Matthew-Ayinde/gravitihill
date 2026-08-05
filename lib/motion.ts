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

/** The 240ms page crossfade. Chosen over the --ridge wipe: a full-screen wipe
 *  would be a second attention-grabbing effect, and boldness is spent once. */
export const pageTransition: Transition = {
  duration: 0.24,
  ease: EASE_BRAND,
};
