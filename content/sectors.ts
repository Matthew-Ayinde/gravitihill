import { unstable_cache } from "next/cache";
import type { Sector } from "@/lib/schemas";
import { listSectors } from "@/lib/repositories/sectors";

/**
 * THE THREE SECTORS.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /sectors, /sectors/[slug] and the signature pinned panel,
 * backed by MongoDB. Order matters (the panel advances Consumer → B2B →
 * Technology in this order), so lib/repositories/sectors.ts sorts by the
 * `order` field admin writes maintain, not by slug or insertion order.
 */

const TAG = "sectors";

const readSectors = unstable_cache(async () => listSectors(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getSectors(): Promise<Sector[]> {
  return readSectors();
}

export async function getSector(slug: string): Promise<Sector | undefined> {
  const sectors = await getSectors();
  return sectors.find((s) => s.slug === slug);
}
