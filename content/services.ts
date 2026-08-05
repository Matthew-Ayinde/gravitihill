import { practiceSchema, type Practice } from "@/lib/schemas";
import { MEDIA } from "@/content/media";
import { z } from "zod";

/**
 * THE FOUR PRACTICES.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * This module is the data layer for /services and /services/[slug]. When the
 * admin panel lands, replace the array below with a fetch and keep the schema
 * parse — every consumer reads `PRACTICES` and `getPractice()`, so nothing
 * downstream changes.
 *
 * The full service lists are carried in full deliberately. The specificity of
 * these lists is the strongest credibility asset the firm has; trimming them
 * to fit a layout would be trading the argument for the design.
 */

const practices: Practice[] = [
  {
    slug: "brand-development",
    name: "Brand Development",
    proposition:
      "A brand is what the market can predict about you. We build the system that makes it predictable.",
    thesis: [
      "Most brand work stops at identity. Ours starts there and runs to the point where a customer decides — the shelf, the pitch, the renewal conversation, the complaint.",
      "That means designing the experience and the engagement in the same brief, then measuring both. Creative direction and data sit in one team, not two.",
      "The output is a brand platform your commercial teams can actually run: assets, message architecture, channel logic, and a health measure you can take again next quarter.",
    ],
    offerings: [
      {
        name: "Customer Experience Design",
        icon: "customer-experience",
        note: "Map every point the customer meets the business, then rebuild the ones that lose them.",
      },
      {
        name: "Customer Engagement Strategy",
        icon: "stakeholder-engagement",
        note: "Decide what the brand says, to whom, on which channel, and how often.",
      },
      {
        name: "Immersive Tech Integration",
        icon: "innovation",
        note: "Deploy AR, interactive and in-venue technology where it shortens the path to purchase.",
      },
      {
        name: "Data Analytics",
        icon: "insights",
        note: "Instrument the brand so creative decisions have evidence behind them.",
      },
      {
        name: "Content & Digital Marketing",
        icon: "brand-building",
        note: "Build the content engine and the calendar that keeps it fed.",
      },
      {
        name: "Traditional Marketing",
        icon: "growth",
        note: "Broadcast, print, outdoor and activation, planned against the same measurement frame as digital.",
      },
      {
        name: "Brand Health Check",
        icon: "diagnosis",
        note: "A repeatable diagnostic on awareness, equity, sentiment and share of voice.",
      },
      {
        name: "Event Design",
        icon: "execution",
        note: "Design and run events that carry the brand rather than borrow it.",
      },
      {
        name: "Brand Platform & Asset Design",
        icon: "strategy",
        note: "Positioning, architecture, identity and the asset library that holds them together.",
      },
      {
        name: "Internal Branding",
        icon: "people-culture",
        note: "Get staff telling the same story the marketing does — the gap between the two is where trust leaks.",
      },
      {
        name: "Corporate Reputation Management",
        icon: "governance",
        note: "Position the institution with regulators, media and the market, and hold that position under pressure.",
      },
    ],
    cover: MEDIA["practice-brand-development"],
    relatedSectors: ["consumer", "technology"],
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    proposition:
      "Strategy that survives contact with the operating model, because we work on both.",
    thesis: [
      "Nigerian enterprises rarely fail for want of a strategy. They fail because the structure, the process and the people were never redesigned to carry it.",
      "We diagnose the whole system — commercial, operational, organisational — and sequence the changes so the business keeps trading while it transforms.",
      "Engagements end with an implementation plan owned by named executives, not a document.",
    ],
    offerings: [
      {
        name: "Business Transformation",
        icon: "execution",
        note: "Redesign how the business earns, delivers and scales, then run the change through to adoption.",
      },
      {
        name: "Corporate Strategy Development & Implementation",
        icon: "strategy",
        note: "Set the direction, choose where to compete, and build the plan that gets it done.",
      },
      {
        name: "Organisation Design",
        icon: "organisational-design",
        note: "Structure, spans, layers and decision rights matched to the strategy they serve.",
      },
      {
        name: "Process Mapping & Optimisation",
        icon: "process-optimisation",
        note: "Document how work actually flows, then remove the steps that add cost without adding value.",
      },
      {
        name: "Due Diligence",
        icon: "research",
        note: "Commercial, operational and reputational diligence ahead of an investment or a partnership.",
      },
      {
        name: "Value Chain & Market Expansion",
        icon: "value-chain",
        note: "Find the margin sitting in adjacent links of the chain and build the case to take it.",
      },
      {
        name: "Growth Strategy",
        icon: "growth",
        note: "Identify the two or three moves that actually move revenue, and drop the rest.",
      },
      {
        name: "People & Culture",
        icon: "people-culture",
        note: "Align capability, incentives and behaviour with what the strategy demands.",
      },
      {
        name: "Audience Penetration Strategy",
        icon: "market-expansion",
        note: "Win a defined segment deliberately rather than pursuing everyone at once.",
      },
    ],
    cover: MEDIA["practice-business-advisory"],
    relatedSectors: ["b2b", "consumer"],
  },
  {
    slug: "executive-coaching",
    name: "Executive Coaching",
    proposition:
      "Boardroom problems are rarely technical. The Naked Board takes them on directly.",
    thesis: [
      "The hardest problems an executive team faces are the ones nobody will name in the room: succession, founder dependence, a culture that punishes bad news, a board that rubber-stamps.",
      "The Naked Board is our proprietary coaching platform, built for exactly those conversations. It runs as a structured programme, not a series of one-to-one sessions.",
      "Sessions combine blended learning, design-thinking tooling and real case material, facilitated by people who have sat on the other side of the table.",
    ],
    offerings: [
      {
        name: "Blended Learning Coaching Methods",
        icon: "executive-coaching",
        note: "Facilitated sessions, self-directed work and applied practice in one programme.",
      },
      {
        name: "Design Thinking Tools",
        icon: "innovation",
        note: "Structured tooling that gets a divided leadership team to a decision.",
      },
      {
        name: "Executive Mentoring",
        icon: "leadership",
        note: "Sustained one-to-one work with executives carrying a specific mandate.",
      },
      {
        name: "Case Studies & Scenario-Based Learning",
        icon: "diagnosis",
        note: "Rehearse the decision on a real case before making it on your own balance sheet.",
      },
      {
        name: "Industry & Subject-Matter Sharing Sessions",
        icon: "stakeholder-engagement",
        note: "Closed sessions with operators who have handled the problem in front of you.",
      },
    ],
    cover: MEDIA["practice-executive-coaching"],
    relatedSectors: ["b2b", "technology"],
    platformHref: "/the-naked-board",
  },
  {
    slug: "market-expansion",
    name: "Market Expansion",
    proposition:
      "West Africa rewards preparation. We do the preparation before the capital moves.",
    thesis: [
      "Entering Nigeria on a market-sizing deck is how good companies lose two years. The binding constraints are regulatory, political and relational, and none of them appear in a growth forecast.",
      "We scope the opportunity, test it against reputational and legal diligence, map the stakeholders who decide, and put you in the room with them.",
      "Where a client needs it, we stay on through the first phase of operations rather than handing over at the strategy.",
    ],
    offerings: [
      {
        name: "Engagement Strategy",
        icon: "stakeholder-engagement",
        note: "Sequence who you meet, in what order, carrying what proposition.",
      },
      {
        name: "Due Diligence",
        icon: "research",
        note: "Reputational, legal and market-dynamics diligence on partners, targets and counterparties.",
      },
      {
        name: "Market Entry Advisory",
        icon: "market-expansion",
        note: "Choose the entry mode — organic, joint venture, acquisition, licence — and build the case for it.",
      },
      {
        name: "Opportunity Scoping & Risk Planning",
        icon: "diagnosis",
        note: "Size the prize and name what would have to go wrong for it to disappear.",
      },
      {
        name: "Political, Regulatory & Economic Analysis",
        icon: "governance",
        note: "Read the policy environment and the direction it is moving before it moves.",
      },
      {
        name: "Stakeholder Mapping",
        icon: "organisational-design",
        note: "Identify who holds influence, who holds authority, and where those two differ.",
      },
      {
        name: "Strategic Meetings",
        icon: "leadership",
        note: "Convene and prepare the meetings that decide whether an entry proceeds.",
      },
      {
        name: "Operations Management",
        icon: "performance",
        note: "Stand up and run the first phase of in-market operations.",
      },
    ],
    cover: MEDIA["practice-market-expansion"],
    relatedSectors: ["b2b", "consumer", "technology"],
  },
];

export const PRACTICES = z.array(practiceSchema).parse(practices);

export function getPractice(slug: string): Practice | undefined {
  return PRACTICES.find((p) => p.slug === slug);
}

export const PRACTICE_SLUGS = PRACTICES.map((p) => p.slug);
