# BUILD BRIEF: Graviti Hill Limited Website

**Role:** You are a staff-level product engineer and design lead. You have shipped marketing sites for management consultancies and you are known for work that looks commissioned, not generated. Every decision below is deliberate. Do not improvise around it.

**Stack (already scaffolded, do not re-init):** Next.js 16 (App Router), TypeScript (strict), Tailwind CSS, framer-motion. Deploy target: Vercel.

**The single job of this site:** make Graviti Hill credible enough to be shortlisted on an enterprise RFP. Primary audience is Nigerian enterprise C-suite and multinationals entering West Africa; secondary is funded startups and scale-ups. Every visual decision is subordinate to that. A visitor should close the tab thinking *these people are serious*, not *nice website*.

---

## 0. NON-NEGOTIABLE CONSTRAINTS

Read these first. Violating any one of them fails the build.

### 0.1 The logo is a logo. Full stop.
The Graviti Hill mark (blue-to-green wave/hill) may **only** appear as the approved lockup. Do **not**:
- extract the wave curves into dividers, backgrounds, watermarks, scroll motifs, loaders, or textures
- recolour, stretch, skew, rotate, animate, mask, or parallax the mark
- render it below 120px wide in digital contexts

Approved lockups only: black wordmark on light backgrounds, white wordmark on dark backgrounds, green (`#206616`) wordmark as an alternate on light. Maintain clear space equal to the height of the mark's cap-height on all four sides.

This means **the site's visual signature must come from typography, layout, colour discipline and motion, not from the brand mark.** That is the hard part of this brief. Do it properly.

### 0.2 The anti-generic ban list
The client will reject anything that looks AI-assembled. These are banned outright:

- gradient-mesh blobs, aurora backgrounds, animated gradient orbs
- glassmorphism, frosted cards, `backdrop-blur` used decoratively
- purple/violet/indigo anywhere; any accent colour outside the brand palette
- emoji in UI, sparkle icons, "AI-powered" pill badges
- `rounded-3xl` on everything; drop shadows on every card
- typewriter effects, counting-up number animations, particle fields
- three-column "Our Features" card grids with an icon, a bold line and two lines of grey text
- generic testimonial carousels with quotation-mark glyphs
- `bg-gradient-to-r from-X to-Y` on headline text
- Lorem ipsum, or copy that says "elevate," "unlock," "seamlessly empower," "in today's fast-paced world"
- stock illustrations of abstract people, isometric 3D scenes, or hand-drawn arrows
- WebGL, Three.js, Lottie, or any dependency over ~40kb gzipped for decoration

### 0.3 Spend boldness in exactly one place
The site has **one** signature interaction (§5.2). Everything else is quiet, disciplined, and precise. If you find yourself adding a second attention-grabbing effect, delete it.

---

## 1. INFORMATION ARCHITECTURE

Replace the current single-page anchor-scroll site with true multi-page routing.

```
/                          Home
/about                     About, history, DNA, leadership
/services                  Overview of the four practices
/services/brand-development
/services/business-advisory
/services/executive-coaching
/services/market-expansion
/the-naked-board           Standalone landing page for the proprietary coaching platform
/sectors                   Overview: Consumer, B2B, Tech
/sectors/consumer
/sectors/b2b
/sectors/technology
/insights                  Thought leadership index (filterable)
/insights/[slug]           Article detail
/contact                   Contact + enquiry form
```

Service and sector detail pages use `generateStaticParams` over a typed content source. Do not hardcode four near-identical page files.

**Global nav:** About · Services (dropdown/mega-panel) · Sectors · Insights · Contact. One CTA: **Start a conversation** → `/contact`. Sticky, transparent over the hero, solidifying to `--canvas` with a hairline bottom rule after ~80px of scroll. Mobile: full-screen overlay, staggered link reveal, no hamburger-to-X cuteness beyond a clean two-line morph.

**Footer:** three columns: navigation, contact block (address, email, three phone numbers), and a short positioning line. Bottom bar: legal, LinkedIn, © year. Dark (`--ridge`) with the white-wordmark lockup.

---

## 2. DESIGN SYSTEM

### 2.1 Colour tokens

Defined in `globals.css` as CSS custom properties, surfaced to Tailwind via `@theme`.

| Token | Hex | Role |
|---|---|---|
| `--canvas` | `#FDFDFC` | Default page background |
| `--canvas-alt` | `#EDECED` | Alternating section background (brand light gray) |
| `--ink` | `#0B0B0B` | Body text (brand black) |
| `--ink-muted` | `#5A5F5A` | Secondary text, captions, metadata |
| `--green` | `#206616` | Primary brand: headings, key shapes, emphasis |
| `--ridge` | `#0D2A0B` | Dark-panel background. Derived by darkening `--green`; used **only** as a surface, never as type or a mark colour |
| `--accent` | `#8ABF4D` | Icons, data points, single highlighted words, active states |
| `--white` | `#FFFFFF` | Type and surfaces on dark |
| `--rule` | `rgba(11,11,11,0.12)` | Hairline dividers on light |
| `--rule-dark` | `rgba(255,255,255,0.16)` | Hairline dividers on dark |

**Enforced balance: 70% neutral / 20% dark green / 10% accent.** The accent green is a scalpel: one highlighted word in a headline, an active nav underline, an icon fill, a data point. Never a button fill, never a large area, never a background.

Buttons: primary is `--green` fill with white label; on dark panels it inverts to white fill with `--green` label. Secondary is a hairline outline. No third button style.

### 2.2 Typography

The brand specifies **Acumin Variable Extra Condensed** (primary) and **Acumin Variable Semi Condensed** (secondary). Acumin is Adobe Fonts and cannot be self-hosted, so build on a free variable substitute with a one-line swap path.

**Use `Archivo` (Google Fonts, variable). It carries both a weight axis (100-900) and a width axis (`wdth` 62-125), which lets a single superfamily reproduce Acumin's Extra Condensed / Semi Condensed / Normal system exactly.** This is the reason for the choice: one family, three widths, no mismatched pairing.

```
Display  : Archivo,  wdth 72,  wght 600-700,  tracking -0.02em   (hero, page titles, section heads)
Subhead  : Archivo,  wdth 88,  wght 500-600,  tracking -0.01em   (card titles, service names)
Body     : Archivo,  wdth 100, wght 400,      tracking 0,  1.6 line-height
Eyebrow  : Archivo,  wdth 112, wght 600,      uppercase, tracking 0.14em, 12px
```

Load via `next/font/google` with `variable: '--font-archivo'`, `display: 'swap'`, and the axes declared so only one file downloads. Set widths with `font-variation-settings`, exposed as Tailwind utilities (`.w-xcond`, `.w-semicond`, `.w-normal`, `.w-wide`).

**Swap path:** every font declaration reads from `--font-display` / `--font-body`, which resolve to the Archivo stack. When the client acquires an Adobe Fonts licence, swapping to Acumin is a change to two CSS variables plus the Typekit `<link>`, with no component edits. Document this in `README.md`.

**Type scale** (fluid, `clamp()`, no arbitrary values scattered in components):

```
hero      clamp(3.25rem, 7.5vw, 7rem)     line-height 0.94
h1        clamp(2.75rem, 5.5vw, 4.75rem)  line-height 0.98
h2        clamp(2rem, 3.6vw, 3.25rem)     line-height 1.04
h3        clamp(1.375rem, 2vw, 1.75rem)   line-height 1.15
body-lg   clamp(1.0625rem, 1.2vw, 1.25rem)
body      1rem
caption   0.8125rem
```

Headlines are set tight and large. Measure for body copy caps at **68 characters**. Never centre a paragraph longer than two lines.

### 2.3 Layout

12-column grid, `max-width: 1440px`, gutters `clamp(1.25rem, 5vw, 6rem)`. Section vertical rhythm: `clamp(6rem, 12vh, 11rem)`.

Asymmetry is the rule. Prose sits in columns 1-7 or 6-12, never dead-centre. Section eyebrows sit in the left margin as a sticky label where vertical space allows. Editorial hairline rules (`--rule`, 1px) separate content blocks, not borders around cards.

Cards, where they exist, are `--canvas-alt` or hairline-outlined, `border-radius: 4px` maximum. **No shadows.** Depth comes from surface contrast and generous space.

Section rhythm across the site, light-dominant with three deliberate dark moments:

```
LIGHT   hero, about, services overview, leadership, insights, social wall
DARK    Sectors (§5.2 signature), The Naked Board, contact/CTA block
```

Dark panels use `--ridge` with white type and `--accent` used once. They should feel like a held breath, not a theme change.

### 2.4 Imagery

Replace all current stock (the rocket, the gold particle wave, the leaf shadow, the flatlay). Curate replacements with a single consistent grade: **desaturated, cool-neutral, documentary.** Real African business environments, architecture, ports and logistics, boardrooms, manufacturing floors, Lagos infrastructure. No smiling-team-around-a-laptop. No hands-shaking. No people looking at a chart.

Rules: full-bleed or column-aligned only, never floated mid-paragraph. Aspect ratios `3:2` and `4:5` only. All images via `next/image` with `sizes`, blur placeholders, and real `alt` text. Apply a consistent subtle treatment (a `--ridge` overlay at 8-14% on dark panels) so mismatched stock reads as one library.

Leadership headshots: build a placeholder-tolerant `<PersonCard>` that renders a typographic monogram block (initials in `--green` on `--canvas-alt`) when `photo` is absent, so the layout is complete without real photography. Same principle for client logos: `<LogoWall>` renders nothing rather than empty boxes when the array is empty.

---

## 3. CONTENT

All copy lives in typed content modules under `/content` (e.g. `content/services.ts`, `content/sectors.ts`, `content/team.ts`, `content/insights.ts`), each exporting objects that satisfy a Zod schema in `lib/schemas.ts`. Pages read from these modules. **This is the seam for the future admin panel** — when the CMS lands, only the data-fetching layer changes. Comment that intent at the top of each module.

Copy may be rewritten and expanded. Tighten the existing site's prose: it's long, repetitive, and passive. Cut "we help," "we are able to," and "in today's landscape." Write in plain declaratives. Keep the substance — the specificity of the service lists is the strongest asset they have.

### 3.1 Verified facts (use exactly; do not invent numbers, clients or awards)

- Business advisory and branding firm. Founded **2022**, Lagos.
- Leadership carries **55+ years cumulative experience**.
- Positioning: *Re-definers of Brand Building*.
- Purpose: build and sustain future-forward businesses.
- Origin: founded on the tension between creative thinking and tangible business impact — abundant ideas, poor translation into measurable outcomes.

**Leadership**
- **Dr. Ken Onyeali Ikpe** — Chairman/CEO. Immediate past Group CEO of Insight Redefini Group (a TROYKA company), Sub-Saharan Africa's largest marketing communications and consumer consulting group. PhD in Development Economics; alumnus of the Advanced Management Programme, Lagos Business School; trained at IESE Business School, Barcelona.
- **Bukola Shobowale** — Partner. Former Head of Business at QuadrantMSL and Business Director at Insight Publicis. 15+ years leading brands to optimal service delivery and equity. Graduate of the School of Strategy, Harvard Business School.
- **Tunde Samuel-Ipaye** — Partner. Senior executive with a history in management consulting (Philips Consulting) and Group Strategy Director at Insight Redefini. Skilled in business planning, HR consulting, business transformation, and M&A. Warwick Business School; alumnus of London Business School.

**Brand DNA (four pillars)** — Strategically Creative · Efficiency-Driven Innovation · Holistic Systems Approach · People-Centric.

**Four practices, with their full service lists** (carry all of these across — the depth is the credibility):
1. **Brand Development** — Customer Experience Design; Customer Engagement Strategy; Immersive Tech Integration; Data Analytics; Content & Digital Marketing; Traditional Marketing; Brand Health Check; Event Design; Brand Platform/Asset Design; Internal Branding; Corporate Reputation Management.
2. **Business Advisory** — Business Transformation; Corporate Strategy Development & Implementation; Organisation Design; Process Mapping & Optimisation; Due Diligence; Value Chain & Market Expansion; Growth Strategy; People & Culture; Audience Penetration Strategy.
3. **Executive Coaching** — delivered through **The Naked Board**, their proprietary executive coaching platform for boardroom challenges and cultural transformation. Offering: Blended Learning Coaching Methods; Design Thinking Tools; Executive Mentoring; Case Studies & Scenario-Based Learning; Industry and Subject-Matter Sharing Sessions.
4. **Market Expansion** — Engagement Strategy; Due Diligence (reputational, legal, market dynamics); Market Entry Advisory; Opportunity Scoping & Risk Planning; Political, Regulatory & Economic Analysis; Stakeholder Mapping; Strategic Meetings; Operations Management.

**Three sectors**, each with a proposition, a strategic approach, and a differentiator:
- **Consumer** — *From passive consumers to raving fans.* Holistic brand experience; personalised message formats; multi-channel engagement. Differentiators: data-driven consumer insights; creative brand anchors; seamless customer engagement.
- **B2B** — *Robust lead generation frameworks.* Synergistic integration of business advisory and lead generation; customised operational efficiency solutions. Differentiators: synergy with advisory services; customised scalability; continuous improvement.
- **Technology** — *Tailored brand building powered by tech.* Technology integration and optimisation; custom tech roadmaps; innovation and adaptation. Differentiator: long-term technological partnership.

**Contact** — 2nd Floor, Megamound Head Office, Muri Okunola Extension, Victoria Island, Lagos, Nigeria · info@gravitihill.com · 0802 224 2156 · 0803 201 1936 · 0805 477 8494

### 3.2 Insights
Seed with 3–4 entries using real signals from their output, including *Converting China's Zero-Tariff Access into Market Share — why market access alone is not enough for Nigerian exporters*. Mark seeded bodies clearly as placeholder in the content module. Article schema: `title, slug, excerpt, category, author, publishedAt, readingTime, coverImage, body (MDX-ready)`. Index supports category filtering. Dates render editorially — `06 / 07 / 26`.

### 3.3 Social wall (static)
A curated static section rendering three post formats drawn from the brand's own templates: **Quote Card**, **Stat Card**, **Article Cover**. Data-driven from `content/social.ts`, each item linking out to LinkedIn. No live embeds, no third-party scripts, no iframes. Present as a three-across editorial grid on desktop, a horizontal snap-scroll rail on mobile.

---

## 4. ICONOGRAPHY

The brand uses a **filled duotone** icon style: solid `--green` base with `--accent` as the secondary fill, no strokes, no outlines. Build a small typed icon set as inline SVG components in `components/icons/` covering: Strategy, Brand Building, Growth, Insights, Diagnosis, Execution, People/Culture, Leadership, Governance, Market Expansion, Process Optimisation, Customer Experience, Innovation, Value Chain, Executive Coaching, Organisational Design, Performance, Research, Stakeholder Engagement.

Do not import Lucide, Heroicons, or any icon library — their stroke style contradicts the brand. Every icon is `currentColor`-aware for the base fill and takes an `accentClassName` for the secondary. Consistent 24px grid, 2 fills maximum per icon.

---

## 5. MOTION

Library: `framer-motion`. Motion is *considered*, not expressive: it should feel like the page is being composed, not performing.

### 5.1 Baseline vocabulary
- **Reveal on scroll:** `opacity 0→1`, `y 16px→0`, `duration 0.6s`, `ease: [0.22, 1, 0.36, 1]`, `viewport={{ once: true, margin: '-12%' }}`. Stagger children at 60–80ms.
- **Headline entrance:** line-level mask reveal (each line clipped by `overflow-hidden`, inner span translating up). Line-level only — **never per-character**. Per-character is the clearest tell of a generated build.
- **Page transitions:** a fast `--ridge` wipe or a 240ms crossfade. Choose one and use it everywhere.
- **Hover:** links get an underline that draws from left (`scaleX` origin-left, 240ms). Cards lift by shifting background tone, not `translateY` + shadow. Buttons shift fill by ~6% luminance.
- **Nav:** background and rule fade in on scroll past 80px.
- `prefers-reduced-motion: reduce` disables all transforms and reveals; content renders in its final state immediately. Non-negotiable.

### 5.2 THE SIGNATURE — Sticky-pinned Sectors panel

This is the one bold moment. It lives on `/` and anchors `/sectors`.

A full-viewport dark (`--ridge`) section that pins while the user scrolls through three states — **Consumer → B2B → Technology**:

- **Left column (sticky):** the sector index as three large display-set numerals and names stacked vertically. The active sector is white at `wdth 72, wght 700`; inactive sectors sit at 28% opacity. A 1px `--accent` rule slides vertically to mark the active item.
- **Right column:** the full-bleed sector image crossfades between states (`opacity` + a 1.04→1 scale settle, 700ms). Beneath it, the proposition line and the three strategic-approach points swap with a masked line reveal.
- **Progress:** a thin `--accent` progress rule along the bottom edge tracks scroll through the pinned range.
- **Implementation:** `useScroll` with `offset: ['start start', 'end end']` on a container roughly `300vh` tall, `useTransform` to derive an active index, and `AnimatePresence mode="wait"` for the content swap. Pinning is achieved with `position: sticky` on the inner viewport-height wrapper — **not** a scroll-jacking library.
- **Mobile (<1024px):** the pin is disabled entirely. It degrades to three stacked full-bleed panels with standard reveals. Do not attempt a scaled-down pin on touch.
- **Reduced motion:** renders as the three stacked panels, no pin, no crossfade.

The secondary quiet moment, and the only other place motion is allowed to be noticed: the **Insights and Leadership index rows** — editorial list rows where hovering reveals a large image preview that follows the cursor with heavy damping (`useSpring`, `stiffness: 120, damping: 24`). Desktop only; on touch the image renders inline in the row. Nothing else on the site gets a custom cursor behaviour.

---

## 6. PAGE SPECS

**`/` Home** — (1) Type-first hero: `We build and sustain future-forward businesses.` set at hero scale on `--canvas`, columns 1–9, with the approved logo lockup in the nav and *one* word carrying `--accent`. Below the fold line: the purpose statement in 2 lines and a single CTA. No hero image; imagery starts at scroll. (2) About précis + the 55+ years figure set as editorial data, not a stat card. (3) Four practices as a hairline-ruled editorial list, each row expanding to reveal 3 sample services on hover/tap. (4) **Sectors signature panel.** (5) Brand DNA — four pillars as a hairline 2×2 grid with duotone icons. (6) The Naked Board teaser (dark). (7) Insights — three latest. (8) Social wall. (9) Contact CTA (dark).

**`/about`** — Positioning statement, the 2022 origin story set as a proper narrative with a pull-quote, the four DNA pillars in depth, leadership index rows (§5.2 secondary), and a closing CTA.

**`/services` + details** — Overview page lists the four practices with their full service counts. Each detail page: full-bleed cover image, the practice thesis, then the complete service list as a numbered editorial two-column layout with duotone icons, then cross-links to relevant sectors and a CTA. Executive Coaching links prominently to `/the-naked-board`.

**`/the-naked-board`** — Its own identity within the system: dark-dominant, the proprietary-platform framing up top, the five offerings as a stepped sequence, an eligibility/who-it's-for block, and a booking CTA. This should read as a product, not a service page.

**`/sectors` + details** — Overview hosts the signature panel. Details carry the proposition, strategic approach, and "what makes us different" with real depth.

**`/insights` + `/insights/[slug]`** — Filterable index with editorial rows. Article template: max 68ch measure, drop-cap-free, generous spacing, sticky share rail on desktop, related articles, and `Article` JSON-LD.

**`/contact`** — Split layout. Left: the enquiry form. Right: the address, a map-free location block, and **three routes to reach them** — WhatsApp deeplink (`https://wa.me/234...` for the primary number, prefilled message), direct tel: links for all three numbers, and the email. Given the market, WhatsApp converts better than a form; give it equal visual weight.

**Form spec:** fields — name, company, role, work email, phone (optional), enquiry type (select: Brand Development / Business Advisory / Executive Coaching / Market Expansion / General), budget range (optional select), message. Zod validation client + server, inline errors in the interface voice ("Enter a work email so we can reply"), honeypot field, simple in-memory rate limit on the route handler, `POST /api/contact` using Nodemailer with SMTP credentials from env (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`). Send a formatted internal notification and a plain-text acknowledgement to the sender. Real pending/success/error states — no toast library, an inline state change. Never expose SMTP errors to the client.

---

## 7. SEO — build this to a standard that ranks

- `metadata` and `generateMetadata` on every route: unique title, description, canonical, OpenGraph, Twitter card.
- Title pattern: `{Page} | Graviti Hill` — home is `Graviti Hill | Business Advisory & Brand Building, Lagos`.
- Dynamic OG images via `next/og` `ImageResponse` at `opengraph-image.tsx` per route group, using the approved logo lockup and the type system.
- `app/sitemap.ts` and `app/robots.ts` generated from the content modules.
- **JSON-LD** via a typed helper: `Organization` + `ProfessionalService` (with `address`, `telephone`, `areaServed: NG/West Africa`, `foundingDate: 2022`) sitewide; `Person` for each leader; `Service` on practice pages; `Article` + `BreadcrumbList` on insights; `WebSite` with `SearchAction` on home.
- Semantic HTML: one `h1` per page, ordered headings, `<nav>`, `<main>`, `<article>`, real `<address>`.
- Local SEO: NAP consistency for the Victoria Island address across footer, contact page and schema.
- Every image has meaningful `alt`; decorative images get `alt=""`.
- Target Lighthouse ≥ 95 across the board, LCP < 2.0s on a throttled 4G profile, CLS < 0.05. Hero LCP element is text, so it should be near-instant — do not undermine that with a blocking font or animation.

---

## 8. ENGINEERING STANDARDS

- **Server Components by default.** Client components are motion islands only — mark them `'use client'` at the leaf, never at a page or layout. The Sectors panel, nav, form, and hover-preview rows are the client boundaries; nothing else needs to be.
- Content stays server-side; ship no content JSON to the client that the page already rendered.
- Folder structure: `app/`, `components/ui/`, `components/sections/`, `components/icons/`, `content/`, `lib/`, `types/`.
- No `any`. Zod schemas as the single source of truth, with types inferred from them.
- Tailwind: tokens in `@theme`, no arbitrary values in components except genuine one-offs. Extract repeated compositions into components, not `@apply` soups.
- Accessibility to **WCAG 2.2 AA**: visible focus rings (`--accent`, 2px offset), skip link, logical tab order, `aria-current` on nav, labelled form fields, `aria-live` on form status, keyboard-operable everything. Verify `--accent` on `--canvas` fails contrast for text — so it is never used for body copy, only for large display type or non-text elements.
- Bundle budget: first-load JS under 130kb gzipped on the home route.
- `README.md` documenting env vars, the font swap path, the content-to-CMS seam, and how to add a service, sector, or article.

---

## 9. BUILD SEQUENCE

1. Tokens, fonts, Tailwind theme, base layout, nav, footer. Get the type scale and colour discipline right before anything else — everything downstream depends on it.
2. Content modules + Zod schemas + placeholder-tolerant primitives (`PersonCard`, `LogoWall`, `ImageOrMonogram`).
3. Static pages: about, services (index + detail), the-naked-board, sectors detail, contact.
4. The signature Sectors panel. Build it last among the sections and give it real time.
5. Insights, social wall, form + route handler.
6. SEO layer, JSON-LD, OG images, sitemap.
7. Audit pass: reduced-motion, keyboard, mobile at 360px, Lighthouse.

---

## 10. ACCEPTANCE CRITERIA

- [ ] The logo appears only as an approved lockup; no derived wave graphics anywhere.
- [ ] Colour audit shows roughly 70/20/10 neutral / dark green / accent. Accent is never a background or a button fill.
- [ ] Exactly one signature interaction. No second competing effect.
- [ ] Zero items from the §0.2 ban list.
- [ ] Every page has unique metadata, canonical, OG image and appropriate JSON-LD.
- [ ] Full keyboard traversal with visible focus; `prefers-reduced-motion` removes all transforms.
- [ ] The site is complete and composed with zero leadership photos and zero client logos present.
- [ ] Renders correctly at 360px, 768px, 1024px, 1440px, 1920px.
- [ ] Lighthouse ≥ 95 / first-load JS < 130kb on `/`.
- [ ] Reading any three consecutive paragraphs of copy, none contain "elevate," "unlock," "seamlessly," or "in today's."

---

## 11. FINAL DIRECTION

The reference for energy and structure is **livespot360.com** — oversized display type, revealed rather than served content, full-bleed imagery, editorial date and index formatting, and a confident light/dark rhythm. But Livespot is an entertainment company and can afford to be loud. Graviti Hill is bidding for enterprise work.

**Take Livespot's confidence and give it McKinsey's composure.** Same scale of type, same command of the page, none of the party. If a decision could be described as "fun," it is wrong for this brief. If it could be described as "assured," it is right.

Before you write a line of code, state your design plan: the six colour tokens in use, the three type widths and their roles, an ASCII wireframe of the home page, and a one-sentence description of the signature moment. Check that plan against §0.2 and §11, revise anything that reads as a default, say what you changed and why — then build exactly to the revised plan.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
