/** Frozen snapshot of content/insights.ts — see practices.ts header for why. */

import type { z } from "zod";
import type { articleBlockSchema } from "@/lib/schemas";
import { ZERO_TARIFF_BODY, ZERO_TARIFF_EXCERPT } from "./zero-tariff-article";

/** Input shape: defaults such as `ordered` may be omitted. */
type Block = z.input<typeof articleBlockSchema>;

export type SeedInsight = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  coverImageKey: string;
  placeholderBody: boolean;
  body: Block[];
};

export const SEED_INSIGHTS: SeedInsight[] = [
  {
    slug: "converting-chinas-zero-tariff-access-into-market-share",
    title: "Converting China's Zero-Tariff Access into Market Share",
    excerpt: ZERO_TARIFF_EXCERPT,
    category: "Market Expansion",
    author: "Graviti Hill",
    publishedAt: "2026-07-06",
    readingTime: 7,
    coverImageKey: "insight-zero-tariff",
    placeholderBody: false,
    body: ZERO_TARIFF_BODY,
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
    coverImageKey: "insight-brand-health",
    placeholderBody: true,
    body: [
      { type: "p", text: "Most brand tracking arrives once a year, in a deck, three months after the period it describes. By the time the board reads it, the budget that would have responded to it has already been committed." },
      { type: "h2", text: "A diagnostic you can act on" },
      { type: "p", text: "A useful brand health check does four things: it measures the same variables every quarter, it reports them against a decision the business is about to make, it separates awareness from preference, and it is short enough that people read it." },
      { type: "list", items: [
        "Unprompted awareness within the defined segment, not the general population",
        "Preference and consideration, tracked separately — they move independently",
        "Sentiment across owned, earned and trade channels",
        "Share of voice against the two competitors that actually take your volume",
      ]},
      { type: "p", text: "The point is not the number. The point is the direction of the number and whether last quarter's spend moved it." },
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
    coverImageKey: "insight-transformation",
    placeholderBody: true,
    body: [
      { type: "p", text: "Transformation programmes are usually designed for the top of the organisation and communicated to the bottom. The middle — heads of function, regional managers, the people who own the process — are asked to implement a change that reduces their discretion and adds to their reporting." },
      { type: "h2", text: "Redesign the decision rights, not just the org chart" },
      { type: "p", text: "Structure follows strategy only if decision rights follow structure. Redrawing boxes without redrawing who approves what leaves the old operating model intact under a new diagram." },
      { type: "quote", text: "A programme that has not changed anyone's authority has not changed anything." },
      { type: "p", text: "The sequencing that works: name the decisions, assign them, then adjust the structure to match. The reverse order produces a reorganisation and calls it a transformation." },
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
    coverImageKey: "insight-boards",
    placeholderBody: true,
    body: [
      { type: "p", text: "Every board has a small number of items that never make the agenda. They are not forgotten; they are avoided, because raising them costs the person who raises them more than the silence costs the institution." },
      { type: "h2", text: "Three that recur" },
      { type: "list", items: [
        "Succession, where naming a successor is read as a move against the incumbent",
        "Founder dependence, where the person who built the business is now the constraint on it",
        "The cost of dissent, where a culture that punishes bad news stops receiving any",
      ]},
      { type: "p", text: "These are not technical problems and they do not yield to better reporting. They require a facilitated setting where the conversation is structured and the incentive to stay silent is removed. That is the specific job The Naked Board was built to do." },
    ],
  },
];
