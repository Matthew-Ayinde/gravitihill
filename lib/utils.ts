/**
 * Minimal class joiner. Deliberately not clsx/tailwind-merge — this project has
 * a 130kb first-load budget and no component takes conflicting utility classes.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Editorial date format — `06 / 07 / 26`. Used everywhere a date renders.
 * Parsed as UTC so the string is stable between server and client.
 */
export function editorialDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d} / ${m} / ${y.slice(2)}`;
}

/** Machine-readable date for <time dateTime> and JSON-LD. */
export function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

/** `01`, `02`, … for editorial indices. */
export function indexNumber(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/**
 * Forces a `<video>` element to give back its decode buffers before it's
 * unmounted or its source swapped.
 *
 * Removing a video node from the DOM (or just re-rendering it with new
 * `<source>` children, which is what a keyed swap does) does not reliably
 * release the memory Chromium allocated to decode it — the element has to be
 * told explicitly: pause, drop every `<source>`, clear `src`, then call
 * `load()` to reset the media pipeline. Skipping this is what turns a
 * *rotating* video (hero backgrounds, any auto-advancing carousel) into a
 * slow, unbounded memory leak: each swap allocates a new decoder and the old
 * one is never freed, which compounds for as long as the tab stays open.
 *
 * Call this from a cleanup function — either a `useEffect` cleanup keyed to
 * the element's identity, or right before mutating a persistent element's
 * source.
 */
export function releaseVideoElement(video: HTMLVideoElement | null): void {
  if (!video) return;
  video.pause();
  while (video.firstChild) video.removeChild(video.firstChild);
  video.removeAttribute("src");
  video.load();
}
