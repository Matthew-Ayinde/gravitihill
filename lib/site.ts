/**
 * Single source of truth for NAP (name, address, phone) and global navigation.
 *
 * NAP consistency matters for local SEO: the footer, the contact page and the
 * JSON-LD all read from here, so the Victoria Island address can never drift
 * between surfaces.
 */

export const SITE = {
  name: "Graviti Hill",
  legalName: "Graviti Hill Limited",
  positioning: "Re-definers of Brand and Business Performance",
  description:
    "Business advisory and brand building for enterprises operating in Nigeria and West Africa. Founded 2022, Lagos.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gravitihill.com",
  foundingDate: "2022",
  locale: "en_NG",
} as const;

export const ADDRESS = {
  street: "2nd Floor, Megamound Head Office, Muri Okunola Extension",
  locality: "Victoria Island",
  region: "Lagos",
  country: "Nigeria",
  countryCode: "NG",
} as const;

/** Display order matters — the first number is the WhatsApp route. */
export const PHONES = [
  { display: "0802 224 2156", e164: "+2348022242156", whatsapp: true },
  { display: "0803 201 1936", e164: "+2348032011936", whatsapp: false },
  { display: "0805 477 8494", e164: "+2348054778494", whatsapp: false },
] as const;

export const EMAIL = "info@gravitihill.com";

export const LINKEDIN = "https://www.linkedin.com/company/graviti-hill";

/**
 * ADDRESS/PHONES/EMAIL/LINKEDIN above are compiled-in fallback defaults only
 * — lib/settings.ts reads the admin-editable versions from MongoDB (falling
 * back to these if no `settings` document exists yet) and is what pages
 * actually import. See lib/settings.ts for the WhatsApp deeplink builder too;
 * it depends on the live phone list, not this file.
 */

export type NavChild = { label: string; href: string; note: string };
export type NavItem = {
  label: string;
  href: string;
  /** Eyebrow in the left margin of the item's dropdown panel. */
  panelLabel?: string;
  children?: NavChild[];
};

/**
 * Dropdown notes for each practice and sector, keyed by slug. The *names* are
 * admin-editable and come from the database (see `buildNav`), so the
 * dropdowns always match what /services and /sectors show.
 */
const PRACTICE_NOTES: Record<string, string> = {
  "brand-development": "Experience, engagement and reputation",
  "business-advisory": "Strategy, structure and transformation",
  "executive-coaching": "Delivered through The Naked Board",
  "market-expansion": "Entry, diligence and stakeholder mapping",
};

const SECTOR_NOTES: Record<string, string> = {
  consumer: "From passive consumers to raving fans",
  b2b: "Lead generation built on advisory",
  technology: "Brand building powered by tech",
};

export const NAV: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    panelLabel: "Practices",
    children: [
      {
        label: "Brand Development",
        href: "/services/brand-development",
        note: PRACTICE_NOTES["brand-development"],
      },
      {
        label: "Business Advisory",
        href: "/services/business-advisory",
        note: PRACTICE_NOTES["business-advisory"],
      },
      {
        label: "Capacity Development",
        href: "/services/executive-coaching",
        note: PRACTICE_NOTES["executive-coaching"],
      },
      {
        label: "Market Expansion",
        href: "/services/market-expansion",
        note: PRACTICE_NOTES["market-expansion"],
      },
    ],
  },
  {
    label: "Perspectives",
    href: "/sectors",
    panelLabel: "Sectors",
    children: [
      {
        label: "B2C",
        href: "/sectors/consumer",
        note: SECTOR_NOTES.consumer,
      },
      {
        label: "B2B",
        href: "/sectors/b2b",
        note: SECTOR_NOTES.b2b,
      },
      {
        label: "Technology",
        href: "/sectors/technology",
        note: SECTOR_NOTES.technology,
      },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    panelLabel: "The desk",
    children: [
      {
        label: "The lead",
        href: "/insights#lead",
        note: "The newest piece, in full",
      },
      {
        label: "The archive",
        href: "/insights#archive",
        note: "Every earlier piece, filterable by subject",
      },
      {
        label: "Reply",
        href: "/insights#reply",
        note: "Respond to a piece we have published",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    panelLabel: "The firm",
    children: [
      {
        label: "Our Mission",
        href: "/about#mission",
        note: "Why we were founded, and the gap we close",
      },
      {
        label: "Our Strategic DNA",
        href: "/about#strategic-dna",
        note: "Four commitments the work is measured against",
      },
      {
        label: "Leadership",
        href: "/about#leadership",
        note: "Fifty-five years of cumulative experience",
      },
    ],
  },
];

type NamedEntry = { slug: string; name: string };

/**
 * NAV with the Services and Perspectives dropdowns rebuilt from the live
 * practices and sectors, in the same order their pages list them. Either
 * dropdown falls back to its static children above when its list is empty
 * (e.g. an unseeded database).
 */
export function buildNav({
  practices,
  sectors,
}: {
  practices: NamedEntry[];
  sectors: NamedEntry[];
}): NavItem[] {
  const live: Record<string, { base: string; entries: NamedEntry[]; notes: Record<string, string> }> = {
    "/services": { base: "/services", entries: practices, notes: PRACTICE_NOTES },
    "/sectors": { base: "/sectors", entries: sectors, notes: SECTOR_NOTES },
  };
  return NAV.map((item) => {
    const source = live[item.href];
    if (!source || source.entries.length === 0) return item;
    return {
      ...item,
      children: source.entries.map((entry) => ({
        label: entry.name,
        href: `${source.base}/${entry.slug}`,
        note: source.notes[entry.slug] ?? "",
      })),
    };
  });
}

export const FOOTER_NAV: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Perspectives", href: "/sectors" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "The Naked Board", href: "/the-naked-board" },
];
