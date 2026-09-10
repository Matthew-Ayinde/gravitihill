# REDESIGN BRIEF v2: Graviti Hill — Immersive Aesthetic Pass

**Status:** IN PROGRESS.
- ✅ **Phase 0 — tooling.** GSAP + `@gsap/react` + `three` + R3F + drei installed. `ui-ux-pro-max` (and its 6 sibling skills) installed to `.claude/skills/`, gitignored, search tool verified against Python 3.14. 21st.dev MCP connected.
- ✅ **Phase 1 — engine swap.** Framer Motion fully replaced by GSAP across all 24 files that used it; `framer-motion` uninstalled. Typecheck clean, production build passes, all 9 routes return 200 with no console warnings.
- ⬜ Phase 2 — design system v2 primitives (`display-xl`, `type-mono-data`, `<TerrainScene>`, `<EditorialCarousel>`).
- ⬜ Phase 3 — route redesigns (insights → services → about → sectors).
- ⬜ Phase 4 — audit pass.

Decisions in §1 were resolved as the defaults proposed there (Phase 1 scope = the four content routes; GSAP swapped sitewide; logo rule retained).

**Supersedes:** `AGENTS.md` §0–§2, §4–§6, for the scope defined in §1 below. `AGENTS.md` §3 (content), §7 (SEO), §8 (engineering standards) remain in force everywhere — this is a skin and motion-engine change, not a rebuild of the content/data layer, the CMS, or the SEO contract. §0.1 (logo lockup integrity) also remains in force — see §1.3.

---

## 0. What's actually changing, in one paragraph

Framer Motion is replaced by GSAP (core + ScrollTrigger + SplitText — all free since GSAP's 2025 relicense, no Club GreenSock needed) as the animation engine sitewide. The strict "one signature moment, 70/20/10 palette, banned-list" design system in `AGENTS.md` is lifted for `/about`, `/services` (+ details), `/sectors` (+ details), and `/insights` (+ `[slug]`): bigger type, more motion, a real WebGL 3D element, and carousels, in the register of olanrewaju.dev (confident, high-contrast, oversized headline type, live-data-feeling detail work) and livespot360.com (modular full-bleed sections, editorial index/date formatting, carousel galleries, light/dark rhythm) — already this project's stated reference, now allowed to be as loud as that reference actually is, not throttled to "McKinsey composure." White and green stay the spine of the palette; the extended tokens already sitting unused in `globals.css` (`--blue`, `--gold`, `--gold-ink`, `--abyss`, `--navy`) get promoted from "one rare accent" to real working colors. `/`, `/contact`, `/the-naked-board`, nav and footer are **not** touched in this pass — see §1.1 for why and how that resolves.

---

## 1. Open decisions — confirm before implementation starts

### 1.1 Scope: "entire project" vs. the four named routes
The request said both. Resolution used for this brief: **Phase 1 is exactly the four named routes** (`/about`, `/services*`, `/sectors*`, `/insights*`). `/`, `/contact`, `/the-naked-board`, `SiteNav`, `SiteFooter` stay on the current design system. Reasons:
- Home currently carries the sticky-pinned Sectors panel (`/sectors` signature moment) and the LCP-critical text hero — redesigning it is a materially bigger, riskier job than the four content routes and deserves its own pass once Phase 1 has proven the new engine/3D budget actually holds its performance promises.
- A shared nav/footer straddling two design systems is normal during a phased rebrand (it's effectively the "frame" the new pages sit inside) and avoids a big-bang cutover.

**If you actually meant the whole site in one pass**, say so and this becomes Phase 1 = tokens/engine/nav/footer + home, Phase 2 = the four content routes, Phase 3 = contact + the-naked-board. Order matters because nav/footer are shared chrome every other route depends on.

### 1.2 Does GSAP replace Framer Motion everywhere, or only on redesigned routes?
Recommendation: **swap the engine sitewide in one pass**, independent of the aesthetic phasing in §1.1. Running both libraries at once ships two animation runtimes in the bundle for no reason — GSAP core is ~23kb gzipped and tree-shakes per-plugin, so converting `MotionRoot`, `SmoothScroll`, `SplashScreen`, and the still-on-old-aesthetic pages (home hero reveals, nav, sectors panel, footer) to GSAP is cheap and removes `framer-motion` from `package.json` entirely. The alternative — keep Framer Motion on untouched routes, GSAP only on the four new ones — costs more bundle for longer and buys nothing. Confirm this, since it means home/contact/nav/footer motion code gets touched even though their *visual design* doesn't.

### 1.3 The logo rule (AGENTS.md §0.1) stays
Trademark/lockup integrity isn't a "generic AI site" aesthetic complaint, it's brand-legal hygiene, so it survives the reset: approved lockups only, no extracted wave motifs, no recolour/skew/mask/parallax of the mark itself. The 3D signature element in §4 is a distinct abstract form (a topographic terrain mesh — "hill," not the logo), never the wordmark or wave curve. Flag if this reading is wrong.

### 1.4 21st.dev MCP key
The key you pasted (`21st_sk_5e28...`) is now in this conversation's transcript in plaintext. I'll run the `claude mcp add` command exactly as given once we're in the execution phase — not doing it in this prompt-only turn. Worth rotating that key afterward if this transcript is ever shared or logged anywhere you don't fully control; not blocking, just flagging.

### 1.5 Skill install
`ui-ux-pro-max-skill` from GitHub isn't a package-manager install — Claude Code skills are discovered from `.claude/skills/<name>/` (project) or `~/.claude/skills/<name>/` (personal), each needing a `SKILL.md`. Plan is to `git clone` it into `.claude/skills/ui-ux-pro-max/` and verify it exposes a valid `SKILL.md` before it shows up in the skill listing — I'll confirm the exact shape of that repo at execution time rather than assert it here.

---

## 2. Reference synthesis

Grounding note: I fetched both reference URLs as rendered markdown, not screenshots — that pipeline strips canvas/WebGL output, so anything below about 3D/visual texture on either site is inference from what the markup and framework hints (Framer Motion in olanrewaju.dev's stack, section structure) actually showed, not a confirmed pixel-level read. Treat §2 as "the principles worth stealing," not a literal clone target.

**olanrewaju.dev** — bold, oversized headline type; a dark, high-contrast, technical register (terminal-style status chips, live metrics, monospace accents used as a *voice*, not decoration); project cards that read as system-status panels (uptime %, module lists) rather than generic "feature card" grids; a confident single-scroll narrative from hero → work → stack → experience → contact.

**livespot360.com** — modular full-width sections with generous whitespace; a hard contrast between huge display headlines and restrained body type; full-bleed photography; carousel galleries for portfolio/studio work; persistent nav; a light/dark rhythm across sections; hover-interactive cards linking to detail.

**What crosses over to Graviti Hill, translated for an enterprise-advisory audience (not a portfolio, not entertainment):**
- Type scale gets pushed past the current hero clamp — a new `display-xl` tier for section-opening statements, used the way olanrewaju.dev uses its headline weight.
- The "live status/data" voice becomes a legitimate device here: Graviti Hill actually has real data points (55+ years, 2022 founding, service counts, sector approach steps) — render them as monospace/tabular "instrument" typography (index numbers, dates, counters) rather than a fake terminal, so it reads as precision, not cosplay.
- Carousels: article index (`/insights`), practice list (`/services`), and sector approach points (`/sectors`) all get carousel/slider treatments instead of static stacked lists.
- Full-bleed imagery + light/dark rhythm: already Graviti Hill's structure, now allowed more than one dark "moment" per page.

---

## 3. Design system v2 (scoped to Phase 1 routes)

### 3.1 Palette — promote what already exists, don't invent new tokens
`app/globals.css` already defines an extended palette nobody's using at volume yet:

| Token | Hex | New role in Phase 1 |
|---|---|---|
| `--canvas` / `--white` | `#FDFDFC` / `#FFFFFF` | Still the dominant ground — "white and green" stays true even at higher color volume. |
| `--green` | `#206616` | Primary brand action + display headline color, unchanged. |
| `--accent` | `#8ABF4D` | Freed from "one word per page" — usable on dark surfaces at data points, active states, hover states, chart-like elements, still never as body text on light (contrast math in `globals.css` still holds — `2.14:1` on canvas, still fails AA). |
| `--blue` / `--blue-light` | `#1B4F8C` / `#4F86C6` | Promoted to a real secondary: 3D scene rim-light/fresnel, carousel active-state, hover glows, link/interactive states on dark panels. |
| `--gold` / `--gold-ink` | `#C89B3C` / `#8A6317` | Still the rarest — one stat callout, one marker per page — but no longer restricted to non-text; `--gold-ink` is AA-safe as text on light surfaces per the existing contrast note. |
| `--abyss` / `--navy` | `#04140C` / `#0A1A2E` | Two distinct dark planes instead of one repeated `--ridge` fill — alternate between them across a page's dark sections so consecutive dark panels don't read as the same color reused. |

No purple/violet/indigo, no gradient-mesh blobs, no glassmorphism — those bans hold regardless of how loud everything else gets; they're "looks AI-generated," not "looks disciplined," and the client-rejection risk they were written against hasn't changed.

### 3.2 Typography
Keep the Archivo variable infrastructure (`--font-display`/`--font-body`, the `wdth` axis utilities, the Acumin swap path) — that's font-pipeline engineering, not the constrained aesthetic, and rebuilding it buys nothing. What changes is scale and how it's used:

- New tier above hero: `display-xl`, `clamp(4.5rem, 11vw, 11rem)`, line-height `0.9` — for one big kinetic statement per page (SplitText line/word reveal on scroll, GSAP-driven).
- `text-hero`/`text-h1` etc. stay as the working scale for everything else — they're already fluid and already large; Phase 1 just uses them less conservatively (multiple hero-scale moments per page instead of one per site).
- New "instrument" type role: `type-mono-data` — a tabular-nums monospace (system mono stack, no new font load) for index numbers, dates, counters, stat callouts. This is the operationalized version of olanrewaju.dev's terminal voice.
- Outline/stroke headline treatment (`hero-outline` etc., already built for the home hero) becomes available on Phase 1 routes too, not home-exclusive.

### 3.3 Motion — GSAP
- `@gsap/react`'s `useGSAP` hook replaces `motion`/`AnimatePresence` in client leaf components. `gsap.context()` scoping is mandatory on every component that registers ScrollTrigger instances, so route changes (App Router client nav) clean up triggers — this is the #1 cause of a GSAP site "hanging" or animations doubling up on back-navigation, and it's a hard requirement, not a nice-to-have.
- `ScrollTrigger` replaces `useScroll`/`useTransform` for scroll-driven work (the sectors-style pin, if reused; carousel progress; parallax).
- `SplitText` replaces the current line-mask reveal for headline entrances — line and word-level only, never per-character (that ban holds: per-character text animation is a "looks generated" tell independent of which library renders it).
- Lenis (`components/motion/SmoothScroll.tsx`) stays as the smooth-scroll layer; GSAP's `ScrollTrigger.scrollerProxy` syncs to it. (GSAP also ships its own free `ScrollSmoother` now — not worth the swap since Lenis is already integrated and proven in this codebase; don't introduce a second smooth-scroll implementation.)
- `prefers-reduced-motion: reduce` still disables every transform/reveal/3D scene, content renders in final state immediately — non-negotiable, carried over unchanged from `AGENTS.md` §5.1.

### 3.4 The 3D element
One shared, lazily-mounted `<TerrainScene>` (react-three-fiber + drei, not raw Three.js — R3F is idiomatic React, tree-shakes better, and keeps the component boundary consistent with the rest of the codebase's client-island discipline):
- Subject: an abstract low-poly topographic mesh (a stylized "hill/terrain," never the wordmark or wave curve — see §1.3), wireframe-to-shaded on scroll, `--green`/`--blue` lighting.
- Mounted via `next/dynamic({ ssr: false })` behind an `IntersectionObserver` gate — it doesn't initialize until its hero is actually about to enter the viewport, and it unmounts (not just pauses) when scrolled far past, freeing the WebGL context.
- One instance per page, in the hero only. Not a persistent background, not on every section — that's the "must not hang" line.
- Static-image fallback (a pre-rendered still of the same scene) for: `prefers-reduced-motion`, no WebGL support, and a lightweight device-capability check (low core count / save-data header) — the page is complete and fast without it, the same principle `AGENTS.md` already applies to missing photography via `PersonCard`/`LogoWall`.
- Low-poly geometry, no imported textures over ~200kb, capped draw calls, pixel ratio capped at 2 — budget details finalized against a real Lighthouse run in Phase 1's audit step, not guessed upfront.

### 3.5 Carousels
One shared `<EditorialCarousel>` primitive (native CSS scroll-snap + GSAP for the progress indicator/arrow state, not a slider dependency) reused across:
- `/insights` index — article cards.
- `/services` — the four practices, each card expanding to its service list on activation instead of (or alongside) the current hairline-ruled expanding list.
- `/sectors` detail pages — approach points / differentiators as a horizontal rail.
Keyboard-operable (arrow keys, visible focus), swipe on touch, no autoplay (autoplaying carousels on an enterprise site read as the exact "generic" tell the original brief was defending against — that part of the instinct survives even though the ban list otherwise lifts).

---

## 4. Per-route brief

**`/about`** — `display-xl` opening statement (the 2022 origin story's thesis line), `TerrainScene` in the hero. Leadership section becomes a carousel (still `PersonCard`'s monogram-fallback logic underneath — zero real headshots stays true) instead of static index rows. DNA pillars: kinetic reveal, one pillar full-bleed at a time on scroll (GSAP pin) rather than the static 2×2 hairline grid.

**`/services` + details** — Overview: the four practices as large kinetic type, one per full-viewport scroll beat, `type-mono-data` service-count callouts. Detail pages: `TerrainScene` or a full-bleed cover (existing rule) in hero, service list moves into `<EditorialCarousel>`, duotone icons stay (§4 of `AGENTS.md`'s icon system is infrastructure, not aesthetic — keep it, don't rebuild an icon set for this pass).

**`/sectors` + details** — This is where the biggest call is: the current sticky-pinned Consumer→B2B→Technology panel is `AGENTS.md`'s one designated signature moment. Under the new rules "more than one bold moment" is allowed, so the recommendation is to **keep the pin mechanic** (it's genuinely good, and it's the one piece of motion code most worth porting carefully to GSAP ScrollTrigger rather than replacing) but re-skin it at the new type scale and unlock the extended palette per state (Consumer=`--green`/`--accent`, B2B=`--blue`, Technology=`--gold`) instead of one repeated `--abyss` fill for all three. Detail pages get the `<EditorialCarousel>` for differentiators.

**`/insights` + `[slug]`** — Index becomes the carousel described in §3.5 plus a filterable grid below it. Article template: `type-mono-data` date/reading-time, otherwise keeps its current disciplined measure (68ch, no drop caps) — long-form reading is the one place "large and popping" is the wrong call, and the original brief was right about that regardless of which design system is active.

---

## 5. Performance guardrails ("must not load slowly or hang")

1. GSAP core + only the plugins actually used (`ScrollTrigger`, `SplitText`) — no full-bundle import.
2. `TerrainScene` and `EditorialCarousel`'s heavier internals ship via `next/dynamic({ ssr: false })`, mounted only on intersection.
3. Every `useGSAP`/`ScrollTrigger` registration scoped with `gsap.context()` and reverted on unmount — required, not optional, per §3.3.
4. `document.visibilityState` check pauses any rAF-driven loop (3D render loop, carousel auto-progress if any) when the tab is hidden.
5. Per-route first-load JS budget: keep the existing 130kb gzip target for `/`; Phase 1 routes get a slightly relaxed but still enforced 180kb budget given the 3D/carousel additions — measured, not assumed, at the end of each route's build step.
6. Lighthouse ≥ 90 (relaxed from `AGENTS.md`'s ≥ 95 given the 3D scene, but not unbounded) on each redesigned route, checked in the audit step of every phase, not just at the end.
7. `prefers-reduced-motion` and low-capability device paths tested explicitly, not assumed to work because the code looks right.

---

## 6. Build sequence — smaller tasks

**Phase 0 — tooling (next turn, on your go-ahead)**
0.1 Install GSAP (`gsap`, `@gsap/react`), `three`, `@react-three/fiber`, `@react-three/drei`.
0.2 Clone `ui-ux-pro-max-skill` into `.claude/skills/`, verify it loads.
0.3 Run the `claude mcp add` command for 21st.dev exactly as given.
0.4 Confirm §1.1/§1.2/§1.3 decisions.

**Phase 1 — engine swap (sitewide, per §1.2)**
1.1 Port `MotionRoot`, `SmoothScroll`, `SplashScreen` to GSAP/`useGSAP`; wire `ScrollTrigger.scrollerProxy` to Lenis.
1.2 Port the sectors pin (`SectorsPanel.tsx`) motion mechanics to `ScrollTrigger`, behavior-identical, before any re-skin — prove the engine swap first, change the look second.
1.3 Remove `framer-motion` from `package.json` once nothing imports it. `tsc --noEmit` + a full route click-through as the acceptance gate for this phase.

**Phase 2 — design system v2 primitives**
2.1 `display-xl` type tier, `type-mono-data` role, palette promotion in `globals.css`.
2.2 `<TerrainScene>` with all four fallback paths (reduced-motion, no-WebGL, low-capability, static image) before it's used anywhere.
2.3 `<EditorialCarousel>` primitive, keyboard + touch + focus-visible, before it's used anywhere.

**Phase 3 — route-by-route** (one PR-sized chunk each, in this order — insights first since it's the most contained, sectors last since it's the highest-risk port)
3.1 `/insights` + `[slug]`
3.2 `/services` + details
3.3 `/about`
3.4 `/sectors` + details

**Phase 4 — audit pass, per route as it lands, not just at the end**
4.1 Reduced-motion full pass. 4.2 Keyboard-only pass. 4.3 360px/768px/1024px/1440px/1920px. 4.4 Lighthouse + bundle-size check against §5's budgets. 4.5 Throttled-CPU/4G check that the 3D scene actually degrades rather than hangs.

---

## 7. Acceptance criteria (Phase 1 scope)

- [ ] Zero `framer-motion` imports left anywhere in the repo; `framer-motion` removed from `package.json`.
- [ ] Every `ScrollTrigger`/`useGSAP` instance is `gsap.context()`-scoped and verified cleaned up on route navigation (no doubled triggers on back-nav).
- [ ] `<TerrainScene>` never blocks first paint, has all four fallback paths, and only ever mounts one instance per page.
- [ ] `<EditorialCarousel>` is fully keyboard-operable with visible focus and no autoplay.
- [ ] Logo appears only as the approved lockup on every redesigned route — no derived motifs, confirmed against `AGENTS.md` §0.1 which stays in force.
- [ ] No purple/violet/indigo, no gradient-mesh/glassmorphism, on any route.
- [ ] `prefers-reduced-motion` removes all transforms/3D/reveals on every redesigned route.
- [ ] `/insights/[slug]` keeps the 68ch measure and disciplined long-form treatment even though its index page doesn't.
- [ ] Lighthouse ≥ 90 and first-load JS within §5's budget on each of the four redesigned routes.
- [ ] Content modules / Zod schemas / MongoDB-backed admin CMS untouched — this is a presentation-layer change only.
