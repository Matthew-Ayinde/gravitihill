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
  /**
   * Optional ambient motion for this slot.
   *
   * When present, EditorialImage renders a muted, looping, inline <video> and
   * uses `src` above as its poster; when absent — or under
   * prefers-reduced-motion, or on a save-data connection — the still renders
   * instead. So a video is strictly an enhancement of an image that already
   * works, never a replacement for one.
   *
   * Supply at least one of mp4/webm. Keep clips under ~8 seconds and ~1.5 MB:
   * these sit in hero position and the LCP budget is 2.0s on throttled 4G.
   */
  video: z
    .object({
      mp4: z.string().optional(),
      webm: z.string().optional(),
    })
    .refine((v) => Boolean(v.mp4 || v.webm), {
      message: "Provide at least one of video.mp4 or video.webm",
    })
    .optional(),
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

/* ── About ───────────────────────────────────────────────────────────────── */
export const aboutSchema = z.object({
  positioning: z.string().min(1),
  purpose: z.string().min(1),
  precis: z.string().min(1),
  origin: z
    .array(z.object({ heading: z.string().min(1), body: z.array(z.string().min(1)).min(1) }))
    .min(1),
  pullQuote: z.string().min(1),
  facts: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).min(1),
});
export type About = z.infer<typeof aboutSchema>;

/* ── The Naked Board ─────────────────────────────────────────────────────── */
export const nakedBoardStageSchema = z.object({
  name: z.string().min(1),
  icon: iconNameSchema,
  summary: z.string().min(1),
});

export const nakedBoardSchema = z.object({
  name: z.string().min(1),
  premise: z.string().min(1),
  positioning: z.array(z.string().min(1)).min(1),
  stages: z.array(nakedBoardStageSchema).min(1),
  audience: z.array(z.string().min(1)).min(1),
  commitment: z.string().min(1),
});
export type NakedBoard = z.infer<typeof nakedBoardSchema>;

/* ── Settings (NAP) ──────────────────────────────────────────────────────────
   The admin-editable subset of what lib/site.ts hardcodes. lib/site.ts keeps
   ADDRESS/PHONES/EMAIL/LINKEDIN as compiled-in fallback defaults; lib/settings.ts
   reads this shape from Mongo and falls back to those constants if no
   document exists yet. NAV/FOOTER_NAV stay structural, in code, not here. */
export const settingsSchema = z.object({
  address: z.object({
    street: z.string().min(1),
    locality: z.string().min(1),
    region: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().min(1),
  }),
  phones: z
    .array(
      z.object({
        display: z.string().min(1),
        e164: z.string().min(1),
        whatsapp: z.boolean(),
      }),
    )
    .min(1),
  email: z.string().min(1),
  linkedin: z.string().url(),
});
export type Settings = z.infer<typeof settingsSchema>;

/* ── Home hero ────────────────────────────────────────────────────────────────
   Optional background for the / hero: zero to five slides, each reusing
   imageSchema exactly — a still is the slide, and `video` is the same
   ambient-video enhancement AmbientVideo already renders elsewhere (a
   poster is always required before a clip can attach). Zero slides is a
   first-class state: the hero renders exactly as the original type-only
   design. More than one slide auto-rotates on the public page.

   Capped at 5 — a rotating background is already a second animated moment
   on a site whose brief allows one; five is enough for real variety without
   turning the hero into a carousel, and it bounds total page weight even
   though only the active (and, briefly, the incoming) slide is ever
   mounted in the DOM at once. */
export const HOME_HERO_MAX_ITEMS = 5;
export const homeHeroSchema = z.object({
  items: z.array(imageSchema).max(HOME_HERO_MAX_ITEMS).default([]),
});
export type HomeHero = z.infer<typeof homeHeroSchema>;

/* ── Media library ───────────────────────────────────────────────────────────
   The admin's Cloudinary asset catalog — what MediaPicker browses. Content
   documents never reference this by id; they embed a resolved `imageSchema`
   snapshot at save time, same as content/media.ts does today. */
export const mediaAssetSchema = z.object({
  publicId: z.string().min(1),
  secureUrl: z.string().url(),
  alt: z.string(),
  ratio: z.enum(["3:2", "4:5"]).default("3:2"),
  blurDataURL: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  credit: z
    .object({ title: z.string(), author: z.string(), license: z.string(), source: z.string() })
    .optional(),
  createdAt: z.string(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

/* ── Admin users ─────────────────────────────────────────────────────────────
   Server-only. Never imported by a client component. */
export const adminSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(1),
  createdAt: z.string(),
});
export type Admin = z.infer<typeof adminSchema>;

/* ── Contact form ────────────────────────────────────────────────────────────
   Deliberately NOT here. The contact schema is the only schema a client
   component imports, so it lives in lib/contact-schema.ts against `zod/mini`
   to keep ~50 kB of classic-API Zod off /contact. Same library, same
   semantics, one source of truth — see that file's header. The persisted
   contactSubmission shape (contact fields + status/createdAt) is defined
   server-side only, in lib/repositories/contact-submissions.ts, for the same
   reason — it must never pull classic Zod into that client module's graph. */
