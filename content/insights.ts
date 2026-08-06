import { unstable_cache } from "next/cache";
import type { Insight, InsightCategory } from "@/lib/schemas";
import { listInsights } from "@/lib/repositories/insights";

/**
 * INSIGHTS.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /insights and /insights/[slug], backed by MongoDB. `body`
 * remains an array of typed blocks — when MDX lands, swap the block array for
 * a compiled MDX source and update only the renderer in
 * components/sections/ArticleBody.tsx.
 */

const TAG = "insights";

const readInsights = unstable_cache(async () => listInsights(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getInsights(): Promise<Insight[]> {
  return readInsights();
}

export async function getInsight(slug: string): Promise<Insight | undefined> {
  const insights = await getInsights();
  return insights.find((i) => i.slug === slug);
}

/** Categories present in the content, in a stable order, for the index filter. */
export async function getInsightCategories(): Promise<InsightCategory[]> {
  const insights = await getInsights();
  return Array.from(new Set(insights.map((i) => i.category))).sort();
}

/** Same category first, then most recent. Used at the foot of an article. */
export async function getRelatedInsights(slug: string, limit = 2): Promise<Insight[]> {
  const insights = await getInsights();
  const current = insights.find((i) => i.slug === slug);
  if (!current) return insights.slice(0, limit);
  return insights
    .filter((i) => i.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 0 : 1;
      const bMatch = b.category === current.category ? 0 : 1;
      return aMatch - bMatch || b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
