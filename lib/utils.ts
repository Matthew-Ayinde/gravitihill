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
