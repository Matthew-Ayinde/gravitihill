import { insightSchema, type Insight, type InsightCategory } from "@/lib/schemas";
import { MEDIA } from "@/content/media";
import { z } from "zod";

/**
 * INSIGHTS.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /insights and /insights/[slug]. `body` is an array of typed
 * blocks today; when MDX lands, swap the block array for a compiled MDX source
 * and update only the renderer in components/sections/ArticleBody.tsx.
 *
 * ── PLACEHOLDER NOTICE ──────────────────────────────────────────────────────
 * Every record below carries `placeholderBody: true`. Titles, categories and
 * framing are drawn from real signals in the firm's output; the article bodies
 * are seeded scaffolding written to exercise the template and MUST be replaced
 * with editorial copy before launch. The article page renders a visible notice
 * while this flag is set, so a placeholder cannot ship unnoticed.
 */

const insights: Insight[] = [
  {
    slug: "converting-chinas-zero-tariff-access-into-market-share",
    title: "Converting China's Zero-Tariff Access into Market Share",
    excerpt:
      "Zero-tariff entry removes one barrier and exposes four others. Nigerian exporters who treat access as the strategy will find the shelf already taken.",
    category: "Market Expansion",
    author: "Graviti Hill",
    publishedAt: "2026-07-06",
    readingTime: 7,
    coverImage: MEDIA["insight-zero-tariff"],
    placeholderBody: true,
    body: [
      {
        type: "p",
        text: "Market access is a permission, not a position. The removal of tariff lines changes the landed cost of a Nigerian product in China; it does not change whether a Chinese buyer has heard of it, trusts it, or can source it reliably at volume.",
      },
      { type: "h2", text: "Access is the cheapest part of the problem" },
      {
        type: "p",
        text: "Exporters entering on a tariff advantage alone compete on price against incumbents who already hold distribution, certification and buyer relationships. The advantage is real and it is temporary — it lasts exactly as long as it takes a competitor to secure the same terms.",
      },
      {
        type: "list",
        items: [
          "Certification and standards compliance, which is slower and more expensive than most forecasts assume",
          "Cold chain and logistics reliability at the volumes a distributor will commit to",
          "Distributor selection, where the wrong partner costs a category two years",
          "Category education, because an unfamiliar origin carries a discount until it does not",
        ],
      },
      { type: "h2", text: "What the preparation actually involves" },
      {
        type: "p",
        text: "The work is sequencing: diligence on partners before commitment, stakeholder mapping across the regulatory and commercial chain, and a clear reading of which policy positions are stable and which are in motion. None of it is glamorous and all of it decides the outcome.",
      },
      {
        type: "quote",
        text: "The exporters who convert access into share are the ones who did the diligence while the tariff conversation was still a headline.",
      },
      {
        type: "p",
        text: "Treat the tariff change as a window that has opened on a room you have not yet surveyed. The survey is the strategy.",
      },
    ],
  },
  {
    slug: "the-brand-health-check-most-boards-are-not-running",
    title: "The Brand Health Check Most Boards Are Not Running",
    excerpt:
      "Brand equity is measured annually, if at all, and reported as a number nobody can act on. A quarterly diagnostic changes what the board can decide.",
    category: "Brand Building",
    author: "Graviti Hill",
    publishedAt: "2026-06-04",
    readingTime: 6,
    coverImage: MEDIA["insight-brand-health"],
    placeholderBody: true,
    body: [
      {
        type: "p",
        text: "Most brand tracking arrives once a year, in a deck, three months after the period it describes. By the time the board reads it, the budget that would have responded to it has already been committed.",
      },
      { type: "h2", text: "A diagnostic you can act on" },
      {
        type: "p",
        text: "A useful brand health check does four things: it measures the same variables every quarter, it reports them against a decision the business is about to make, it separates awareness from preference, and it is short enough that people read it.",
      },
      {
        type: "list",
        items: [
          "Unprompted awareness within the defined segment, not the general population",
          "Preference and consideration, tracked separately — they move independently",
          "Sentiment across owned, earned and trade channels",
          "Share of voice against the two competitors that actually take your volume",
        ],
      },
      {
        type: "p",
        text: "The point is not the number. The point is the direction of the number and whether last quarter's spend moved it.",
      },
    ],
  },
  {
    slug: "why-transformation-programmes-stall-at-the-second-layer",
    title: "Why Transformation Programmes Stall at the Second Layer",
    excerpt:
      "The executive team agrees, the front line adapts, and the layer between them quietly holds the old model in place. That layer is the programme.",
    category: "Business Advisory",
    author: "Graviti Hill",
    publishedAt: "2026-04-22",
    readingTime: 5,
    coverImage: MEDIA["insight-transformation"],
    placeholderBody: true,
    body: [
      {
        type: "p",
        text: "Transformation programmes are usually designed for the top of the organisation and communicated to the bottom. The middle — heads of function, regional managers, the people who own the process — are asked to implement a change that reduces their discretion and adds to their reporting.",
      },
      { type: "h2", text: "Redesign the decision rights, not just the org chart" },
      {
        type: "p",
        text: "Structure follows strategy only if decision rights follow structure. Redrawing boxes without redrawing who approves what leaves the old operating model intact under a new diagram.",
      },
      {
        type: "quote",
        text: "A programme that has not changed anyone's authority has not changed anything.",
      },
      {
        type: "p",
        text: "The sequencing that works: name the decisions, assign them, then adjust the structure to match. The reverse order produces a reorganisation and calls it a transformation.",
      },
    ],
  },
  {
    slug: "what-boards-will-not-say-out-loud",
    title: "What Boards Will Not Say Out Loud",
    excerpt:
      "Succession, founder dependence and the cost of dissent are the three items most Nigerian boards defer. Deferral is itself a decision.",
    category: "Leadership",
    author: "Graviti Hill",
    publishedAt: "2026-03-11",
    readingTime: 6,
    coverImage: MEDIA["insight-boards"],
    placeholderBody: true,
    body: [
      {
        type: "p",
        text: "Every board has a small number of items that never make the agenda. They are not forgotten; they are avoided, because raising them costs the person who raises them more than the silence costs the institution.",
      },
      { type: "h2", text: "Three that recur" },
      {
        type: "list",
        items: [
          "Succession, where naming a successor is read as a move against the incumbent",
          "Founder dependence, where the person who built the business is now the constraint on it",
          "The cost of dissent, where a culture that punishes bad news stops receiving any",
        ],
      },
      {
        type: "p",
        text: "These are not technical problems and they do not yield to better reporting. They require a facilitated setting where the conversation is structured and the incentive to stay silent is removed. That is the specific job The Naked Board was built to do.",
      },
    ],
  },
];

export const INSIGHTS = z
  .array(insightSchema)
  .parse(insights)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export const INSIGHT_SLUGS = INSIGHTS.map((i) => i.slug);

/** Categories present in the content, in a stable order, for the index filter. */
export const INSIGHT_CATEGORIES: InsightCategory[] = Array.from(
  new Set(INSIGHTS.map((i) => i.category)),
).sort();

/** Same category first, then most recent. Used at the foot of an article. */
export function relatedInsights(slug: string, limit = 2): Insight[] {
  const current = getInsight(slug);
  if (!current) return INSIGHTS.slice(0, limit);
  return INSIGHTS.filter((i) => i.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === current.category ? 0 : 1;
      const bMatch = b.category === current.category ? 0 : 1;
      return aMatch - bMatch || b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
