import { z } from "zod";

/**
 * Single source of truth for every content shape on the site. Types are
 * inferred from these schemas — never declared alongside them — so a schema
 * change is a type error, not a silent drift.
 *
 * Content modules under /content parse themselves against these at import time.
 * When the admin panel lands, the CMS response is validated by the same
 * schemas and only the data-fetching layer changes.
 */

/* ── Iconography ─────────────────────────────────────────────────────────────
   Filled duotone only: a solid --green base with --accent as the secondary
   fill. No strokes, no outlines. No icon library — Lucide/Heroicons are stroke
   sets and contradict the brand outright. */
export const iconNameSchema = z.enum([
  "strategy",
  "brand-building",
  "growth",
  "insights",
  "diagnosis",
  "execution",
  "people-culture",
  "leadership",
  "governance",
  "market-expansion",
  "process-optimisation",
  "customer-experience",
  "innovation",
  "value-chain",
  "executive-coaching",
  "organisational-design",
  "performance",
  "research",
  "stakeholder-engagement",
]);
export type IconName = z.infer<typeof iconNameSchema>;

/* ── Imagery ─────────────────────────────────────────────────────────────────
   Every image is optional by design. The site must be complete and composed
   with zero photography present, so components fall back to typographic
   plates rather than empty boxes. Ratios are constrained to 3:2 and 4:5. */
export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  ratio: z.enum(["3:2", "4:5"]).default("3:2"),
  /** Base64 data URL for next/image blur placeholder. */
  blurDataURL: z.string().optional(),
});
export type Img = z.infer<typeof imageSchema>;

/* ── Services (the four practices) ──────────────────────────────────────── */
export const serviceOfferingSchema = z.object({
  name: z.string().min(1),
  icon: iconNameSchema,
  /** One declarative sentence. No "we help", no "we are able to". */
  note: z.string().min(1),
});

export const practiceSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  /** Sits under the page title. Two lines maximum. */
  proposition: z.string().min(1),
  /** The argument for the practice. Three to five sentences. */
  thesis: z.array(z.string().min(1)).min(2),
  offerings: z.array(serviceOfferingSchema).min(3),
  /** Sector slugs this practice most often runs into. */
  relatedSectors: z.array(z.string()),
  cover: imageSchema.optional(),
  /** Set on Executive Coaching only — drives the Naked Board cross-link. */
  platformHref: z.string().optional(),
});
export type Practice = z.infer<typeof practiceSchema>;

/* ── Sectors ─────────────────────────────────────────────────────────────── */
export const sectorSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  /** The line that carries the sector. Renders at display scale. */
  proposition: z.string().min(1),
  thesis: z.array(z.string().min(1)).min(1),
  approach: z
    .array(z.object({ name: z.string(), note: z.string(), icon: iconNameSchema }))
    .length(3),
  differentiators: z
    .array(z.object({ name: z.string(), note: z.string() }))
    .min(1),
  image: imageSchema.optional(),
});
export type Sector = z.infer<typeof sectorSchema>;

/* ── Leadership ──────────────────────────────────────────────────────────── */
export const personSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  /** Rendered as prose, not bullet soup. */
  bio: z.array(z.string().min(1)).min(1),
  credentials: z.array(z.string().min(1)),
  /** Absent photo is the expected state — PersonCard renders a monogram. */
  photo: imageSchema.optional(),
  linkedin: z.string().url().optional(),
});
export type Person = z.infer<typeof personSchema>;

/* ── Brand DNA ───────────────────────────────────────────────────────────── */
export const pillarSchema = z.object({
  name: z.string().min(1),
  icon: iconNameSchema,
  summary: z.string().min(1),
  detail: z.string().min(1),
});
export type Pillar = z.infer<typeof pillarSchema>;

/* ── Insights ────────────────────────────────────────────────────────────── */
export const insightCategorySchema = z.enum([
  "Market Expansion",
  "Brand Building",
  "Business Advisory",
  "Leadership",
]);
export type InsightCategory = z.infer<typeof insightCategorySchema>;

export const insightSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: insightCategorySchema,
  author: z.string().min(1),
  /** ISO date. Renders editorially as `06 / 07 / 26`. */
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readingTime: z.number().int().positive(),
  coverImage: imageSchema.optional(),
  /** MDX-ready. Paragraph strings today; an MDX source string later. */
  body: z.array(
    z.union([
      z.object({ type: z.literal("p"), text: z.string() }),
      z.object({ type: z.literal("h2"), text: z.string() }),
      z.object({ type: z.literal("quote"), text: z.string() }),
      z.object({ type: z.literal("list"), items: z.array(z.string()) }),
    ]),
  ),
  /** True while the body is seeded rather than editorial. Renders a notice. */
  placeholderBody: z.boolean().default(false),
});
export type Insight = z.infer<typeof insightSchema>;

/* ── Social wall ─────────────────────────────────────────────────────────── */
export const socialPostSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("quote"),
    id: z.string(),
    quote: z.string().min(1),
    attribution: z.string().min(1),
    href: z.string().url(),
    postedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  z.object({
    format: z.literal("stat"),
    id: z.string(),
    value: z.string().min(1),
    label: z.string().min(1),
    source: z.string().min(1),
    href: z.string().url(),
    postedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  z.object({
    format: z.literal("cover"),
    id: z.string(),
    title: z.string().min(1),
    kicker: z.string().min(1),
    href: z.string().url(),
    postedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
]);
export type SocialPost = z.infer<typeof socialPostSchema>;

/* ── Contact form ────────────────────────────────────────────────────────────
   Deliberately NOT here. The contact schema is the only schema a client
   component imports, so it lives in lib/contact-schema.ts against `zod/mini`
   to keep ~50 kB of classic-API Zod off /contact. Same library, same
   semantics, one source of truth — see that file's header. */
