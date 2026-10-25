"use client";

/**
 * Which home-hero background slide is currently showing.
 *
 * HeroBackground owns the rotation; HeroCopy swaps the foreground text to
 * match it. They sit in different branches of the hero (the copy lives
 * inside the Tilt3D plane, the background behind it), so the same
 * module-store + `useSyncExternalStore` pattern as `lib/hero-gate` carries
 * the index between them instead of threading state through the page.
 */

let active = 0;
const listeners = new Set<() => void>();

export function setHeroSlide(index: number) {
  if (index === active) return;
  active = index;
  listeners.forEach((l) => l());
}

export function subscribeHeroSlide(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getHeroSlideSnapshot() {
  return active;
}

export function getHeroSlideServerSnapshot() {
  return 0;
}
