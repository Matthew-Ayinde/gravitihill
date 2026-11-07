import type { MetadataRoute } from "next";
import { getSectors } from "@/content/sectors";
import { getInsights } from "@/content/insights";
import { SITE } from "@/lib/site";

/**
 * Generated from the content modules, not hand-maintained. Adding a sector or
 * an article puts it in the sitemap with no further action.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [sectors, insights] = await Promise.all([
    getSectors(),
    getInsights(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 },
      { url: `${SITE.url}/about`, changeFrequency: "yearly", priority: 0.8 },
      { url: `${SITE.url}/services`, changeFrequency: "yearly", priority: 0.9 },
      { url: `${SITE.url}/sectors`, changeFrequency: "yearly", priority: 0.8 },
      {
        url: `${SITE.url}/the-naked-board`,
        changeFrequency: "yearly",
        priority: 0.8,
      },
      { url: `${SITE.url}/insights`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.9 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  return [
    ...staticRoutes,
    ...sectors.map((sector) => ({
      url: `${SITE.url}/sectors/${sector.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...insights.map((insight) => ({
      url: `${SITE.url}/insights/${insight.slug}`,
      lastModified: new Date(insight.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
