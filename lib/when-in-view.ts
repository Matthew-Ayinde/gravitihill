/**
 * Runs `callback` once, the first time `node` is on screen — immediately (on
 * the observer's first report) if it already is. Returns a teardown.
 *
 * For on-load entrances. They are time-based, not scroll-scrubbed, so a page
 * opened at a deep link (/insights#archive, /about#leadership) would otherwise
 * play its hero off screen and leave a finished headline waiting above the
 * reader. Gating on visibility makes the entrance play when it is first seen.
 *
 * The observer's first report lands a frame after `observe()`, which is after
 * the router has applied the hash scroll — so it measures where the page
 * actually opened, not the top.
 */
export function whenInView(node: Element, callback: () => void): () => void {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  });
  for (const target of observable(node)) observer.observe(target);
  return () => observer.disconnect();
}

/**
 * An element with `display: contents` generates no box, so an observer never
 * reports it as intersecting — the callback would never run and an entrance
 * would hold its content at opacity 0 for good. Observe its boxed descendants
 * instead: any one of them on screen means the block is on screen.
 */
function observable(node: Element): Element[] {
  if (getComputedStyle(node).display !== "contents") return [node];
  const targets = Array.from(node.children).flatMap(observable);
  return targets.length > 0 ? targets : [node];
}
