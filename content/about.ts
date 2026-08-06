import { unstable_cache } from "next/cache";
import type { About } from "@/lib/schemas";
import { getAbout as readAboutDoc } from "@/lib/repositories/about";

/**
 * ABOUT — positioning, purpose, origin.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /about and the précis section on /, backed by MongoDB.
 * Singleton document — `npm run seed` (or a first save from /admin/about)
 * must exist before these pages can render.
 *
 * Facts are verified: founded 2022 in Lagos; positioning "Re-definers of
 * Brand Building"; purpose to build and sustain future-forward businesses.
 * Do not add clients, awards or figures that aren't verified.
 */

const TAG = "about";

const readAbout = unstable_cache(async () => readAboutDoc(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getAbout(): Promise<About> {
  const doc = await readAbout();
  if (!doc) {
    throw new Error(
      'About has no content yet. Run "npm run seed" or save it from /admin/about.',
    );
  }
  return doc;
}
