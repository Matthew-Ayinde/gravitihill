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

Copy to `.env.local`.

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | **yes** | Connection string for the content database (Atlas or self-hosted) |
| `MONGODB_DB` | no | Database name. Defaults to `gravitihill` |
| `CLOUDINARY_CLOUD_NAME` | **yes** | From the Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | **yes** | From the Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | **yes** | From the Cloudinary dashboard — keep this secret |
| `AUTH_SECRET` | **yes** | Signs admin session cookies. Auto-generated into `.env.local` during setup — a random 256-bit value, not something to invent by hand. Rotating it logs out every admin session |
| `SMTP_HOST` | for the contact form | SMTP relay hostname |
| `SMTP_PORT` | for the contact form | `465` uses implicit TLS; anything else negotiates STARTTLS |
| `SMTP_USER` | for the contact form | Also used as the `From` address |
| `SMTP_PASS` | for the contact form | App password / relay credential |
| `CONTACT_TO` | for the contact form | Internal inbox that receives enquiries |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical origin. Defaults to `https://gravitihill.com`. Set per preview environment so canonicals and OG URLs are right |

Without the SMTP variables, `/api/contact` still validates and **persists every
submission to MongoDB** (visible at `/admin/enquiries`); it just answers 503
instead of sending the two emails, and the interface tells the visitor to use
WhatsApp or email instead of failing silently. SMTP errors are logged
server-side and never returned to the client — a visitor must not learn the
host, port or auth mode from a failed send.

### First-time setup

```bash
npm install
npm run seed          # populates MongoDB + Cloudinary from today's content
npm run admin:create  # prompts for an email + password, creates the first admin
npm run dev
```

`npm run seed` is idempotent — re-running it upserts by each collection's
natural key (slug, id, or a fixed singleton id) rather than duplicating.
`npm run admin:create` is also re-runnable: running it again with the same
email rotates that admin's password.

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

## Content — backed by MongoDB, edited at `/admin`

Every content shape is still defined once, in `lib/schemas.ts`, as a Zod
schema — that hasn't changed, and it's still the single source of truth: a
write is invalid if it doesn't parse, whether it comes from the seed script or
the admin UI. What changed is where the data lives.

`content/*.ts` are no longer static arrays. Each one is now a thin, cached
read layer over a MongoDB collection (via `lib/repositories/*.ts`), exporting
the same `getX()` / `getX(slug)` functions pages already called — this was the
CMS seam the previous static version was built to leave open, and it's now
occupied:

```
content/services.ts     → practices collection    (edit at /admin/services)
content/sectors.ts      → sectors collection       (edit at /admin/sectors)
content/team.ts         → team collection          (edit at /admin/team)
content/dna.ts          → dnaPillars collection     (edit at /admin/dna)
content/insights.ts     → insights collection       (edit at /admin/insights)
content/social.ts       → socialPosts collection    (edit at /admin/social)
content/naked-board.ts  → nakedBoard singleton       (edit at /admin/naked-board)
content/about.ts        → about singleton            (edit at /admin/about)
lib/settings.ts         → settings singleton (NAP)    (edit at /admin/settings)
```

Reads are wrapped in `unstable_cache` with one tag per collection
(`revalidate: 3600` as a time-based fallback); every admin save calls
`updateTag(...)` immediately after writing, so a change is live on the public
site as soon as the save redirects — no rebuild, no waiting on the hourly
fallback. `content/media.ts` is unchanged and still static: it's the local
photography index used only by `npm run seed` to know what to upload to
Cloudinary, not a runtime data source.

### The admin panel

`/admin` — sign in with the account `npm run admin:create` made. Middleware
(`middleware.ts`) gates every route under it; the root layout
(`app/layout.tsx`) detects the admin route via a header middleware sets and
skips the public SiteHeader/SiteFooter/motion chrome for it, so it renders its
own shell (`app/admin/(dashboard)/layout.tsx`) instead.

- **Services, Sectors, Insights, Team, Brand DNA, Social wall** — list + edit
  + delete, one collection each. Sectors and Team also expose a numeric
  "Position" field, since their array order is meaningful on the public site
  (the signature panel's Consumer→B2B→Technology sequence, the leadership
  index order).
- **The Naked Board, About, Settings** — singleton forms (one record each, no
  list view).
- **Media library** (`/admin/media`) — every image field elsewhere in the
  admin opens a picker that browses this library or uploads a new file.
  Uploads go through `app/api/admin/media/route.ts`, which applies the brand's
  photographic grade (`lib/cloudinary.ts`'s `BRAND_TRANSFORM` — desaturate,
  +7% contrast, cool-slate overlay) as a Cloudinary eager transformation, and
  generates a blur placeholder the same way `content/media.ts`'s hand-authored
  ones were made, just automatically.
- **Enquiries** (`/admin/enquiries`) — every `/contact` submission, logged
  independently of whether the email notification sent.

Server Actions (`app/admin/**/actions.ts`) are the only way data changes:
each one re-checks the session, parses the submission against the exact
`lib/schemas.ts` schema used everywhere else, writes through the matching
repository, and calls `updateTag`. `lib/admin/form.ts` holds the shared
FormData-parsing helpers the repeatable-field components
(`components/admin/RepeatableStrings.tsx`,
`components/admin/RepeatableIconRows.tsx`, etc.) rely on.

### Adding a service, sector, or article

Go to the relevant `/admin/*` list page → **New** → fill in the form → save.
The public route (`generateStaticParams` still runs at build time; new slugs
render on-demand via Next's default `dynamicParams` behaviour) and the sitemap
pick it up with no further action.

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
- NAP consistency: the footer, `/contact` and the `Organization` JSON-LD all
  read `lib/settings.ts`'s `getSiteSettings()`, backed by the `settings`
  singleton — edit it once at `/admin/settings`. `lib/site.ts`'s
  `ADDRESS`/`PHONES`/`EMAIL`/`LINKEDIN` are compiled-in fallback defaults only,
  used if no `settings` document exists yet (i.e. before the first seed).

---

## Known state at handover

- **Photography comes from Wikimedia Commons via the seed script** —
  `content/media.ts` documents the licensing obligation (CC BY-SA, attribution
  required) in full. Replace with commissioned or properly licensed stock
  before launch by uploading the replacements at `/admin/media` and swapping
  each `cover` / `image` / `photo` / `coverImage` field to the new asset.
- **Article bodies are seeded.** All four carry `placeholderBody: true` and
  render a visible notice. Titles, categories and framing are real. Toggle the
  flag off at `/admin/insights/[slug]` once the copy is editorial.
- **Social wall links point at the company page**, not at individual posts.
  Replace each `href` at `/admin/social` when the wall is curated.
- **No client logos.** `LogoWall` renders nothing until real, cleared logos
  exist.
- **First-load JS is above the 130 kB brief target** — see the note below.
  `/admin` is a separate route tree and does not affect this budget.

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
