import { unstable_cache, updateTag } from "next/cache";
import {
  getHomeHero as getHomeHeroDoc,
  saveHomeHero as saveHomeHeroDoc,
} from "@/lib/repositories/home-hero";
import { homeHeroSchema, type HomeHero } from "@/lib/schemas";

/**
 * The / hero's optional background media (zero to five slides). Absent is
 * the default and fully-supported state: the hero renders as the original
 * type-only design until an admin sets one at /admin/home.
 */

const DEFAULT_HERO: HomeHero = { items: [] };

const readHomeHero = unstable_cache(
  async (): Promise<HomeHero> => (await getHomeHeroDoc()) ?? DEFAULT_HERO,
  ["home-hero"],
  { tags: ["home-hero"], revalidate: 3600 },
);

/**
 * `unstable_cache` persists its result to disk across dev-server restarts
 * and returns it as-is on a hit: it does not re-run (or re-validate
 * against) this function's schema. A doc cached under an earlier shape of
 * `homeHeroSchema` would otherwise come back verbatim and crash whatever
 * reads `.items` off it. Re-parsing on every read means a stale or malformed
 * cache entry degrades to the empty default instead of taking the page down;
 * `updateTag("home-hero")` in `updateHomeHero` still keeps a real edit fresh.
 */
export async function getHomeHeroMedia(): Promise<HomeHero> {
  const raw = await readHomeHero();
  const parsed = homeHeroSchema.safeParse(raw);
  return parsed.success ? parsed.data : DEFAULT_HERO;
}

export async function updateHomeHero(input: HomeHero): Promise<void> {
  await saveHomeHeroDoc(input);
  updateTag("home-hero");
}
