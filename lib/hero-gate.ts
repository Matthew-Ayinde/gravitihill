"use client";

/**
 * A tiny cross-tree signal between SplashScreen and the home hero's
 * TypedHeadline: "has the splash gate opened (or was it skipped, or never
 * shown at all because of reduced motion)?"
 *
 * The two components are siblings under MotionRoot (see the comment atop
 * SplashScreen), not parent and child, so a prop can't carry this without
 * threading it through a layout neither otherwise needs. A module-level
 * store plus `useSyncExternalStore` is the smallest thing that works.
 *
 * Without this, TypedHeadline starts its typewriter schedule the instant it
 * mounts — which is while the splash still fully covers the viewport, so
 * the whole animation plays out unseen and the headline is already
 * finished the moment the doors part. Gating the schedule on this flag
 * means the first character lands right as the gate opens instead.
 *
 * `ready` starts false on every fresh module load, which is the state we
 * want before the gate has run. `resetHeroReady` re-arms it for a
 * client-side navigation back to "/", where the splash replays but this
 * module stays loaded from the first visit.
 */

let ready = false;
const listeners = new Set<() => void>();

export function markHeroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function resetHeroReady() {
  if (!ready) return;
  ready = false;
  listeners.forEach((l) => l());
}

export function subscribeHeroReady(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getHeroReadySnapshot() {
  return ready;
}

export function getHeroReadyServerSnapshot() {
  return false;
}
