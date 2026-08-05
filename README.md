# Graviti Hill Limited — website

Business advisory and brand building, Lagos. Next.js 16 (App Router), TypeScript
strict, Tailwind CSS v4, framer-motion. Deploy target: Vercel.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

---

## Environment

Copy to `.env.local`. The contact form is the only feature that needs any of
these; without them the route answers 503 and the interface tells the visitor to
use WhatsApp or email instead of failing silently.

| Variable | Required | Notes |
|---|---|---|
| `SMTP_HOST` | yes | SMTP relay hostname |
| `SMTP_PORT` | yes | `465` uses implicit TLS; anything else negotiates STARTTLS |
| `SMTP_USER` | yes | Also used as the `From` address |
| `SMTP_PASS` | yes | App password / relay credential |
| `CONTACT_TO` | yes | Internal inbox that receives enquiries |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin. Defaults to `https://gravitihill.com`. Set per preview environment so canonicals and OG URLs are right |

SMTP errors are logged server-side and never returned to the client — a visitor
must not learn the host, port or auth mode from a failed send.

---

## Typography — and the Acumin swap path

The brand specifies **Acumin Variable Extra Condensed** and **Acumin Variable
Semi Condensed**. Acumin is Adobe Fonts and cannot be self-hosted, so the site
is built on **Archivo** (Google Fonts, variable), which carries both a weight
axis (100–900) and a width axis (62–125). That is the reason for the choice:
one superfamily reproduces Acumin's three-width system exactly, with no
mismatched pairing.

| Role | Width | Weight | Tracking | Used for |
|---|---|---|---|---|
| Display | `wdth 72` | 600–700 | −0.02em | Hero, page titles, section heads |
| Subhead | `wdth 88` | 500–600 | −0.01em | Card titles, service names, article titles |
| Body | `wdth 100` | 400 | 0 | Prose, 68ch measure |
| Eyebrow | `wdth 112` | 600 | 0.14em | Indices, dates, metadata, section labels |

Set widths with the `.w-xcond` / `.w-semicond` / `.w-normal-width` / `.w-wide`
utilities, or the composed roles `.type-display`, `.type-subhead`,
`.type-eyebrow`. Never hardcode `font-variation-settings` in a component.

### Swapping to real Acumin

Every font declaration on the site resolves through two CSS variables. When the
client acquires an Adobe Fonts licence:

1. Add the Typekit `<link>` to `app/layout.tsx`.
2. In `app/globals.css`, point the two variables at Acumin:
   ```css
   --font-display: "acumin-variable", ui-sans-serif, system-ui, sans-serif;
   --font-body:    "acumin-variable", ui-sans-serif, system-ui, sans-serif;
   ```
3. Adjust the four `--wdth-*` stops if Acumin's axis range differs.
4. Remove the `Archivo` import from `app/layout.tsx`.

**No component changes.** Nothing imports a font name directly.

---

## Design tokens

Defined in `app/globals.css`, surfaced to Tailwind through `@theme`.

Six load-bearing colours: `--canvas`, `--canvas-alt`, `--ink`, `--ridge`,
`--green`, `--accent`. `--ink-muted`, `--white`, `--rule` and `--rule-dark` are
derived support. Target balance is 70% neutral / 20% dark green / 10% accent.

### The accent-as-type rule

`--accent` (`#8ABF4D`) on `--canvas` measures **2.14:1** — it fails WCAG 2.2 AA
at every size, including the 3:1 large-text threshold. On `--ridge` it measures
**7.12:1** and passes everywhere. Therefore:

- **light surfaces** — the highlighted word uses `--green` (6.94:1): `.accent-word`
- **dark surfaces** — the highlighted word uses `--accent`: `.accent-word-dark`
- **either** — `--accent` is free on rules, icon fills, progress bars, markers
  and focus rings, which are not text

Use the two utilities rather than the colour directly, so the rule travels with
the markup.

---

## Content — and the CMS seam

All copy lives in typed modules under `content/`, each parsed at import time
against a Zod schema in `lib/schemas.ts`. Types are inferred from the schemas,
never declared beside them.

```
content/services.ts     four practices + full service lists
content/sectors.ts      three sectors (also drives the signature panel)
content/team.ts         leadership
content/dna.ts          the four brand pillars
content/insights.ts     articles
content/social.ts       social wall
content/naked-board.ts  The Naked Board platform
content/about.ts        positioning, origin, facts
```

**This is the seam for the future admin panel.** Each module exports a parsed
constant and a `getX(slug)` accessor. When the CMS lands, replace the literal
array with a fetch and keep the schema parse — every page reads through those
exports, so nothing downstream changes.

### Adding a service

1. Append an entry to `practices` in `content/services.ts` (slug, name,
   proposition, thesis, offerings with an icon key from `iconNameSchema`,
   related sector slugs).
2. Done. `generateStaticParams` picks up the route, the nav mega-panel entry
   comes from `lib/site.ts` (`NAV`), and the sitemap and OG image generate
   themselves.

### Adding a sector

Append to `sectors` in `content/sectors.ts`. `approach` must hold exactly three
items — the pinned panel's layout depends on it, and the schema enforces it. The
signature panel advances in array order.

### Adding an article

Append to `insights` in `content/insights.ts`. Set `placeholderBody: false` once
real copy is in — while it is `true` the article renders a visible placeholder
notice, so seeded scaffolding cannot ship unnoticed. `body` is a typed block
array today; when MDX lands, only `components/sections/ArticleBody.tsx` changes.

---

## Architecture notes

**Server Components by default.** No page and no layout carries `'use client'`.
There are eleven client leaves, and each is a motion island or a genuinely
interactive control:

| File | Why it is a client component |
|---|---|
| `motion/MotionRoot` | LazyMotion provider |
| `motion/PageFade` | 240ms route crossfade |
| `motion/Reveal`, `RevealGroup`, `HeadlineReveal` | scroll reveals |
| `layout/SiteHeader` | scroll state, mega-panel, mobile overlay |
| `sections/SectorsPanel` | the signature pinned interaction |
| `sections/PreviewRows` | cursor-following preview |
| `sections/InsightsIndex` | category filter |
| `sections/ContactForm` | form state and validation |
| `sections/ShareRail` | clipboard action |

Everything else — every page, every content-rendering section, the whole icon
set — is server-rendered.

**Client boundaries never import content modules.** `SectorsPanel` takes
pre-rendered React elements from its server wrapper `SectorsSection`. Importing
`content/sectors.ts` into the client component pulled the module *and Zod* into
the home route's first-load JS — 63 kB gzipped for data the server had already
rendered. The same rule applies to any new interactive section.

**Zod lives in two places for one reason.** `lib/schemas.ts` (classic API)
validates content at build time and never reaches the browser.
`lib/contact-schema.ts` uses `zod/mini` because `ContactForm` is a client
component and the classic API cost 53 kB gzipped on `/contact`. Same library,
same semantics, same single source of truth shared by the form and the route
handler.

**Icons are hand-built.** `components/icons/` holds a filled-duotone set on a
24px grid — a `currentColor` base and an `accentClassName` secondary fill, two
fills maximum. No icon library is installed; Lucide and Heroicons are stroke
sets and read as a different brand next to this type.

**Imagery is optional everywhere.** `EditorialImage`, `PersonPortrait` and the
sector visuals render typographic plates when no asset exists, and `LogoWall`
renders `null` rather than empty boxes. The site is complete and composed with
zero photography present. Dropping real images in is a content change with no
layout consequence.

---

## Motion

The whole vocabulary is `lib/motion.ts`. One signature interaction — the pinned
Sectors panel (`components/sections/SectorsPanel.tsx`) — and one secondary
moment, the cursor-following preview on editorial rows (`PreviewRows`).
Everything else is a 600ms reveal or a 240ms crossfade.

**Reduced motion is enforced twice.** Every motion component checks
`useReducedMotion()` and returns a plain element. That hook resolves after
hydration, so a stylesheet rule is the guarantee:

```css
@media (prefers-reduced-motion: reduce) {
  [data-motion] { opacity: 1 !important; transform: none !important; }
}
```

A stylesheet `!important` beats framer-motion's non-important inline styles, so
content cannot be left frozen at `opacity: 0`. **Any new motion element must
carry `data-motion`.**

The pin itself is gated in CSS, not JS: `hidden motion-safe:lg:block` against
`motion-safe:lg:hidden`. Below 1024px, or under reduced motion at any width,
there is no pin — three stacked panels instead. Because `display: none` removes
a subtree from the accessibility tree, assistive technology only ever meets one
of the two.

---

## Brand mark

`components/ui/Lockup.tsx` is the only place the mark may render. The supplied
brand SVGs are **not yet in the repo**; until they are, it renders a typographic
wordmark — pure type, with no invented approximation of the wave, because a
drawn stand-in would itself breach the usage rules.

To install the real lockup:

1. Add `lockup-black.svg`, `lockup-white.svg` and `lockup-green.svg` to
   `public/brand/`.
2. Set `LOCKUP_ASSET_PRESENT = true` in `components/ui/Lockup.tsx`.

Nothing else changes. Clear space equal to the mark's cap-height is applied by
the component so callers cannot crowd it.

---

## SEO

- `metadata` / `generateMetadata` on every route via `pageMetadata()` in
  `lib/seo.ts` — unique title, description, canonical, OG, Twitter card.
- Dynamic OG images at `opengraph-image.tsx` per route, rendered through
  `lib/og.tsx`. Archivo is fetched at generation time and cached; if that fetch
  fails the card still renders in the default face rather than failing the build.
- `app/sitemap.ts` and `app/robots.ts` generate from the content modules.
- JSON-LD via typed builders in `lib/jsonld.ts`: `Organization` +
  `ProfessionalService` sitewide, `WebSite` + `SearchAction` on home, `Person`
  per leader, `Service` on practice pages, `Article` + `BreadcrumbList` on
  articles.
- NAP consistency: the footer, `/contact` and the schema all read
  `ADDRESS` / `PHONES` / `EMAIL` from `lib/site.ts`. Change it once.

---

## Known state at handover

- **Photography is absent.** Every image slot renders its typographic
  placeholder. See `content/*.ts` — add an `image` / `cover` / `photo` / 
  `coverImage` object (`src`, `alt`, `ratio`, optional `blurDataURL`).
- **Article bodies are seeded.** All four carry `placeholderBody: true` and
  render a visible notice. Titles, categories and framing are real.
- **Social wall links point at the company page**, not at individual posts.
  Replace each `href` in `content/social.ts` when the wall is curated.
- **No client logos.** `LogoWall` renders nothing until real, cleared logos
  exist.
- **First-load JS is above the 130 kB brief target** — see the note below.

### On the JS budget

Measured gzipped first-load, modern browsers (the `noModule` legacy polyfill
chunk is excluded, since no modern browser downloads it):

| Route | First-load JS |
|---|---|
| Framework floor (`/_global-error`, ~no app code) | **130.3 kB** |
| + site shell (nav, footer, motion root) | 152.8 kB |
| `/` | **173.0 kB** |
| `/contact` | 164.6 kB |
| practice / sector / article pages | ~158 kB |

The Next 16 + React 19.2 baseline alone is 130.3 kB gzipped — the brief's entire
budget, before a single line of application code. Everything this site adds on
the home route is **42.7 kB**: framer-motion plus all seven home sections. The
target is not reachable on this stack version; it would need Next 14/React 18,
or dropping framer-motion for CSS-only reveals (~25 kB back, and no pinned
panel). Flagging rather than quietly missing it.

---

## Verified in this build

Checked with Chrome via Playwright against the production build:

- No horizontal overflow on 10 routes × 360 / 768 / 1024 / 1440 / 1920 px.
- `prefers-reduced-motion: reduce` — pin absent, stacked panels shown, all
  content at final opacity with no transforms.
- Pin gating — present at 1440px, absent at 768px.
- Keyboard — skip link is the first tab stop; visible focus ring on 25
  consecutive stops.
- Every route: exactly one `<h1>`, ordered headings, canonical, description,
  `og:image`, valid JSON-LD, `<main>` / `<nav>` / `<footer>` / `<address>`, and
  no `<img>` without `alt`.
