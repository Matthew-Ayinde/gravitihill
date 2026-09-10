/**
 * The whole motion vocabulary of the site, in one file.
 *
 * Engine: GSAP (core + ScrollTrigger + SplitText + CustomEase), registered in
 * lib/gsap.ts. This file holds only values — no gsap import — so it stays
 * safe to pull into a server component for a data attribute or a class name.
 *
 * Motion here is *considered*, not expressive: the page should read as being
 * composed. The redesigned routes (/about, /services, /sectors, /insights)
 * are allowed more than one noticed moment; the rest of the site still gets
 * the quiet baseline.
 */

/** The site's one easing curve — cubic-bezier(0.22, 1, 0.36, 1), registered
 *  as a GSAP CustomEase named "brand" in lib/gsap.ts. */
export const EASE_BRAND = "brand";

/** cubic-bezier(0.16, 1, 0.3, 1) — the depth curve. Registered alongside
 *  "brand" in lib/gsap.ts; used by the /about studio's 3D moves. */
export const EASE_3D = "ease3d";

/** Seconds. The baseline reveal. */
export const DUR_REVEAL = 0.6;
/** Seconds. Line-mask headline reveal — a touch slower than a plain reveal. */
export const DUR_LINE = 0.7;
/** Seconds. Hero-weight entrances: more travel, more time. */
export const DUR_BIG = 0.9;

/** Baseline reveal travel, px. Small enough to read as a fade with intent. */
export const REVEAL_Y = 16;
/** Hero-weight reveal travel, px, plus the scale it settles from. */
export const BIG_REVEAL_Y = 48;
export const BIG_REVEAL_SCALE = 0.97;

/** Children stagger at 60–80ms. */
export const STAGGER = 0.07;
/** Headline lines stagger slightly slower than generic children. */
export const STAGGER_LINES = 0.08;

/**
 * Shared ScrollTrigger start so every reveal on the site fires at the same
 * point. "top 88%" is the GSAP equivalent of framer-motion's
 * viewport={{ margin: '-12%' }} that the site used before the port: the
 * element's top must reach 88% down the viewport.
 */
export const SCROLL_START = "top 88%";

/**
 * Reveals fire once and stay put. `toggleActions` reads
 * onEnter / onLeave / onEnterBack / onLeaveBack — everything but the first is
 * "none", which is what makes it a one-shot.
 */
export const TOGGLE_ONCE = "play none none none";

/** The page transition: a settle-in fade+rise on route change. */
export const DUR_PAGE = 0.5;

/**
 * ── Cursor-driven motion ─────────────────────────────────────────────────
 * GSAP has no spring solver, and it does not need one here: gsap.quickTo with
 * a short duration and a power ease is the idiomatic cursor-follow, and it is
 * cheaper than a spring because it is a single reused tween rather than a new
 * one per pointer event.
 */

/** Magnetic CTAs — tight, so the element feels attached to the cursor. */
export const MAGNETIC_FOLLOW = { duration: 0.4, ease: "power3" } as const;
/** Trailing previews — heavy damping, so the image lags the cursor visibly. */
export const TRAIL_FOLLOW = { duration: 0.7, ease: "power3" } as const;

/** Default vertical travel for <Parallax>, as a fraction of the element's own
 *  height. 0.15 reads clearly without ever detaching content from the scroll. */
export const PARALLAX_RANGE = 0.15;

/**
 * ── On-load entrance ─────────────────────────────────────────────────────
 * <Entrance> composes the first screen of a page when it arrives. Slower and
 * travelling further than a scroll reveal: this is the page arriving, not a
 * block entering view.
 */

/** Seconds per item. */
export const DUR_LOAD = 0.9;
/** Seconds between items in the sequence. */
export const LOAD_STAGGER = 0.09;
/** Rise distance for entrance items, px. */
export const LOAD_Y = 24;
/** Headlines travel further as they wipe up out of their own box. */
export const LOAD_MASK_Y = 40;
