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
  positioning: "Re-definers of Brand Building",
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
 * WhatsApp deeplink for the primary number, message prefilled.
 * In this market WhatsApp converts better than a form — it gets equal weight
 * on /contact, not a footnote.
 */
export const WHATSAPP_URL = `https://wa.me/${PHONES[0].e164.replace(
  "+",
  "",
)}?text=${encodeURIComponent(
  "Hello Graviti Hill — I would like to discuss a project.",
)}`;

export type NavChild = { label: string; href: string; note: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const NAV: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Brand Development",
        href: "/services/brand-development",
        note: "Experience, engagement and reputation",
      },
      {
        label: "Business Advisory",
        href: "/services/business-advisory",
        note: "Strategy, structure and transformation",
      },
      {
        label: "Executive Coaching",
        href: "/services/executive-coaching",
        note: "Delivered through The Naked Board",
      },
      {
        label: "Market Expansion",
        href: "/services/market-expansion",
        note: "Entry, diligence and stakeholder mapping",
      },
    ],
  },
  { label: "Sectors", href: "/sectors" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "The Naked Board", href: "/the-naked-board" },
  { label: "Sectors", href: "/sectors" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];
