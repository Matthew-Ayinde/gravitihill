import { unstable_cache } from "next/cache";
import type { Person } from "@/lib/schemas";
import { listTeam } from "@/lib/repositories/team";

/**
 * LEADERSHIP.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for the /about leadership index and the Person JSON-LD, backed
 * by MongoDB. `photo` stays optional on every record. PersonCard renders a
 * typographic monogram in its place, so the page is complete and composed
 * even for a leader added without a headshot.
 */

const TAG = "team";

const readTeam = unstable_cache(async () => listTeam(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getTeam(): Promise<Person[]> {
  return readTeam();
}

/**
 * Verified: leadership carries 55+ years cumulative experience. Kept as a
 * static, verified figure rather than admin-editable. AGENTS.md is explicit
 * that figures like this are not to be invented or casually revised; update
 * it here deliberately if the leadership roster changes materially.
 */
export const CUMULATIVE_YEARS = "55+";
