import { unstable_cache } from "next/cache";
import type { SocialPost } from "@/lib/schemas";
import { listSocialPosts } from "@/lib/repositories/social";

/**
 * SOCIAL WALL: static-feeling, curated, three formats.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for the social section on /, backed by MongoDB. Still no live
 * embeds, no third-party scripts, no iframes — the admin curates permalinks,
 * the page renders them as ordinary markup.
 */

const TAG = "socialPosts";

const readSocialPosts = unstable_cache(async () => listSocialPosts(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getSocialPosts(): Promise<SocialPost[]> {
  return readSocialPosts();
}
