import { socialPostSchema, type SocialPost } from "@/lib/schemas";
import { z } from "zod";

/**
 * SOCIAL WALL — static, curated, three formats.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for the social section on /. Three post formats drawn from the
 * brand's own templates: Quote Card, Stat Card, Article Cover.
 *
 * No live embeds, no third-party scripts, no iframes. A LinkedIn embed would
 * add a render-blocking origin and a tracking script to the home route for
 * three cards we can render ourselves in markup.
 *
 * ── PLACEHOLDER NOTICE ──────────────────────────────────────────────────────
 * `href` points at the company page on every record. Replace each with the
 * permalink of the actual post when the wall is curated.
 */

const COMPANY_PAGE = "https://www.linkedin.com/company/graviti-hill";

const posts: SocialPost[] = [
  {
    format: "quote",
    id: "quote-brand-predictability",
    quote:
      "A brand is what the market can predict about you. Everything else is advertising.",
    attribution: "Dr. Ken Onyeali Ikpe",
    href: COMPANY_PAGE,
    postedAt: "2026-07-18",
  },
  {
    format: "stat",
    value: "55+",
    id: "stat-cumulative-years",
    label: "Years of cumulative leadership experience across the partnership",
    source: "Graviti Hill leadership",
    href: COMPANY_PAGE,
    postedAt: "2026-06-30",
  },
  {
    format: "cover",
    id: "cover-zero-tariff",
    kicker: "Market Expansion",
    title: "Converting China's Zero-Tariff Access into Market Share",
    href: COMPANY_PAGE,
    postedAt: "2026-07-06",
  },
];

export const SOCIAL_POSTS = z.array(socialPostSchema).parse(posts);
