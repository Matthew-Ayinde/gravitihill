import { unstable_cache } from "next/cache";
import type { Pillar } from "@/lib/schemas";
import { listDnaPillars } from "@/lib/repositories/dna";

/**
 * BRAND DNA — the four pillars.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for the DNA matrix on / and the expanded treatment on /about,
 * backed by MongoDB.
 */

const TAG = "dnaPillars";

const readPillars = unstable_cache(async () => listDnaPillars(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getDnaPillars(): Promise<Pillar[]> {
  return readPillars();
}
