/** Frozen snapshot of content/social.ts — see practices.ts header for why. */

const COMPANY_PAGE = "https://www.linkedin.com/company/graviti-hill";

export const SEED_SOCIAL_POSTS = [
  {
    format: "quote" as const,
    id: "quote-brand-predictability",
    quote: "A brand is what the market can predict about you. Everything else is advertising.",
    attribution: "Dr. Ken Onyeali Ikpe",
    href: COMPANY_PAGE,
    postedAt: "2026-07-18",
  },
  {
    format: "stat" as const,
    id: "stat-cumulative-years",
    value: "55+",
    label: "Years of cumulative leadership experience across the partnership",
    source: "Graviti Hill leadership",
    href: COMPANY_PAGE,
    postedAt: "2026-06-30",
  },
  {
    format: "cover" as const,
    id: "cover-zero-tariff",
    kicker: "Market Expansion",
    title: "Converting China's Zero-Tariff Access into Market Share",
    href: COMPANY_PAGE,
    postedAt: "2026-07-06",
  },
];
