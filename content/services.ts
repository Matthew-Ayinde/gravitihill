import { unstable_cache } from "next/cache";
import type { Practice } from "@/lib/schemas";
import { listPractices } from "@/lib/repositories/practices";

/**
 * THE FOUR PRACTICES.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /services and /services/[slug], now backed by MongoDB via
 * lib/repositories/practices.ts. Reads are cached under the "practices" tag;
 * app/admin/services/actions.ts calls `revalidateTag("practices")` on every
 * write, so an edit is live immediately without a rebuild.
 */

const TAG = "practices";

const readPractices = unstable_cache(async () => listPractices(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getPractices(): Promise<Practice[]> {
  return readPractices();
}

export async function getPractice(slug: string): Promise<Practice | undefined> {
  const practices = await getPractices();
  return practices.find((p) => p.slug === slug);
}
