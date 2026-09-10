# /about — THE EXTRUSION STUDIO

**Status:** §01 BUILT — `<ExtrudedHeading>`, `<Studio>`, the wedge and section 01 are live on /about. Sections 02–05 not yet built (02 currently carries its new copy at flat `text-h2`). Two spec revisions were forced by what the build actually looked like, both recorded in §2.5. Refines `REDESIGN_BRIEF.md` §4 for this one route, and supersedes its §3.4 (`<TerrainScene>` / R3F) *on /about specifically* — see §2 for why WebGL loses here.

**The one-line idea:** the page is a lit studio, and the argument is built out of solid type standing in it. Statements do not fade in — they **extrude into being**, growing depth out of a flat letterform as they settle.

---

## 1. What the reference is actually doing

Stripped of render quality, the reference image is five decisions:

1. **Extruded display type as the subject.** Not a headline over a photo — the type *is* the object, standing on a floor, casting a contact shadow.
2. **Two-colour argument.** The setup is `--ink`, the payoff is `--green`, inside one sentence. The colour break *is* the emphasis; no highlight, no underline, no accent word needed.
3. **A studio, not a background.** Warm off-white cyclorama, soft floor falloff, one soft key light from upper-left. The environment is nearly empty, which is what makes the type read as massive.
4. **Editorial furniture, small and quiet.** `01. — OUR MISSION` at the left margin with a hairline rule; a narrow right column of tight body copy; a small circled arrow with `STRATEGY / BRAND / GROWTH`. All of it whispering so the type can shout.
5. **Asymmetric weight.** Type occupies ~60% of the frame, copy ~22%, and the remaining space is deliberately empty.

All five survive translation to the web. Only the *render quality* (ray-traced soft shadows, depth of field, material sheen) does not — see §2.3.

---

## 2. The technique decision — read this before building anything

### 2.1 The type is CSS 3D, not WebGL. This is not a compromise.

Extruded type gets built by stacking N copies of the same text at increasing `translateZ` inside a `preserve-3d` container, with each layer a step darker, then rotating the whole block. The codebase is already set up for exactly this — `--perspective: 1400px`, `--ease-3d`, and the `perspective-scene` / `preserve-3d` / `backface-hidden` utilities are all in `globals.css` today (lines 75–76, 431–441), unused at this scale.

Why this beats `three.js` `TextGeometry` here, concretely:

| | CSS 3D | TextGeometry |
|---|---|---|
| Is it real text? | **Yes** — selectable, crawlable, screen-readable, translatable | No. Needs a duplicate hidden `<h1>` and it is still invisible to selection/translation |
| Typography control | Full CSS — the variable-width axis, tracking, real line breaks | A converted `typeface.json`; kerning and the `wdth` axis are gone |
| Weight | 0 kB | three.js + font JSON + lighting, ~150 kB before the scene |
| LCP | The `<h1>` paints with the document | Blocked on canvas init and font parse |
| CMS-editable | Yes, it is a string | Regenerating geometry per edit |

For a page whose entire content is words, rendering those words as geometry throws away the thing that matters. **The heading stays a real `<h1>`; depth is decoration added around it.**

### 2.2 The clones are built on the client, after mount

The server sends exactly one copy of the heading. The depth layers are created by JS on hydration.

Two reasons, both load-bearing:
- **SEO.** Sixteen DOM copies of the same sentence in the served HTML is keyword-stuffing in the eyes of a crawler, `aria-hidden` or not. One copy ships; the rest never reach a crawler.
- **It *is* the animation.** Depth literally does not exist until JS builds it, so "extrudes into being" is the honest description of what happens, not an effect layered on top.

### 2.3 What this cannot do, stated plainly

No ray-traced soft shadows, no depth of field, no material sheen or reflection. Expect ~80% of the reference. The 80% comes almost entirely from two things done well:
- **Side-wall darkening** — each depth layer steps from the face colour toward `--ridge`. This single detail is the difference between "3D type" and "a 90s drop shadow."
- **A real contact shadow** — a blurred, floor-plane ellipse under the type block.

If the remaining 20% is wanted later, the escape hatch is a pre-rendered still (Blender/C4D) used as a hero image with the live text kept in `sr-only`. That is a separate decision and it costs CMS-editability, so it is not in this spec.

### 2.4 Degradation — three real tiers, not one scaled down

*(revised — see §2.5: the tier gate is width, not pointer)*

| Tier | Condition | What renders |
|---|---|---|
| Full | ≥1024px, motion allowed | Extrusion + scroll rotation. Cursor lean additionally requires a fine pointer |
| Flat | <1024px | Real text, no clones, no rotation. Sixteen stacked text layers × three headings on a phone GPU is precisely the "hangs" failure mode. Mobile gets a beautiful flat editorial page instead |
| Still | `prefers-reduced-motion: reduce` | Flat text, final state, first paint. No exceptions |

### 2.5 What the build changed about this spec

Two things were wrong on paper and only visible once rendered:

1. **The tier gate was `pointer: fine`; it is now width alone.** Depth has nothing to do with what a reader points with, and Windows reports touchscreen laptops as `pointer: coarse` *even with a mouse attached* — the spec as written would have silently flattened the type for a large slice of real desktop users. Only the cursor lean asks about pointers now.

2. **`translateZ` alone is invisible here, and the first build proved it.** Under a near head-on camera, pushing a layer back in Z scales it a couple of percent toward the vanishing point — sixteen layers produced a concentric shrink, not a side wall. Real extrusion reads because it runs *away from the light*. Layers now step down-right in X/Y (up-left key light) **and** back in Z; the Z term is what keeps the extrusion behaving correctly when the block rotates instead of sliding like a flat drop shadow. Offsets are in `em` so depth stays proportional across the `clamp()` range.

A third correction was visual rather than technical: the floor began as a literal `rotateX(90deg)` plane and was rejected on sight — at this camera angle it collapses to almost nothing and contributed only two hard horizontal edges across the page. It is now a seamless cyclorama falloff, which is what a real studio backdrop is.

---

## 3. The studio

One `perspective-scene` root per section, so every child shares one camera. Inside it:

- **Cyclorama.** `--canvas` with a soft falloff toward the lower edge. This is a studio light gradient, not a decorative one — narrow, neutral, no colour shift. *(Named as a deliberate exception to `REDESIGN_BRIEF` §3.1's gradient ban, which was aimed at mesh/aurora blobs. If the exception is unwanted, a flat fill still works; the contact shadow does most of the grounding.)*
- **Floor.** A `rotateX(90deg)` plane in `--canvas-alt` meeting the cyclorama at a soft seam.
- **Contact shadow.** Blurred dark ellipse on the floor plane, offset opposite the key light, tightening as the type settles. Without this the type floats and the whole illusion dies.
- **The hill.** The reference's lower-left green ramp, built from three CSS-3D planes — a wedge in `--green`/`--ridge` sitting on the floor. This replaces `TerrainScene`: same "abstract terrain, never the logo" intent from `REDESIGN_BRIEF` §1.3/§3.4, at zero library cost and in the same shared perspective, which a WebGL canvas could never be (two rendering contexts cannot share a camera or a floor).

---

## 4. Motion

Engine is GSAP, per Phase 1. Four moves, no more:

1. **The extrusion.** On enter: depth `0 → full` over 900ms, `--ease-3d`, per line, staggered 90ms. One GSAP tween on a CSS variable that all depth layers read — not N tweens.
2. **Scroll rotation.** ScrollTrigger `scrub: true`. The block enters at ~`rotateY(-9deg) rotateX(4deg)` and settles toward flat as it centres, continuing past. Small numbers — this is a camera drifting, not a spin.
3. **Pointer lean.** The whole studio leans ≤3° toward the cursor via `gsap.quickTo`, exactly as `Tilt3D` and `ImageCluster` already do. Desktop only.
4. **Editorial furniture.** The existing baseline `Reveal` / `HeadlineReveal`. Unchanged.

**Line-level only, never per-character.** That ban survives the aesthetic reset — with extrusion it is also a hard performance rule, since per-character clones would mean *characters × depth layers* nodes.

**Budget:** at most **three** extruded headings on the route. Depth layers capped at 16 (hero) / 10 (secondary). `will-change: transform` added on animation start and removed on completion, never left on.

---

## 5. Page structure

Numbered sections in the left margin — the existing `SectionLabel` + `indexNumber` pattern, which already matches the reference's `01. —` furniture. Right column holds tight body copy at `measure-tight`.

```
01  OUR MISSION        [EXTRUDED, hero scale]                    ┌─ right column ─┐
    Founded 2022, on a specific frustration.                     │ 2 short paras  │
      "Founded 2022," in --ink / rest in --green                 │ + circled → +  │
                                                                 │ STRATEGY/BRAND │
02  THE BIGGER PICTURE [EXTRUDED, one step down]                 ┌────────────────┐
    Nigerian business is not short of ideas. It is short         │ what that means│
    of the discipline that turns one into a measurable           │ in practice    │
    outcome.                        ── the hill, lower left      └────────────────┘

03  THE DNA            four pillars, flat type, hairline grid, duotone icons
04  LEADERSHIP         three leads — PersonCard monograms, 55+ years as editorial data
05  ENGAGE             [EXTRUDED, third and last] closing CTA
```

Copy is verified-facts only (`AGENTS.md` §3.1): founded 2022 Lagos, 55+ years cumulative, the creative-thinking-vs-measurable-impact origin, the three named leaders. The reference's own two sentences are excellent and on-fact — use them.

Zero leadership photos and zero client logos, still. `PersonCard`'s monogram fallback covers it.

---

## 6. Build order

1. `<ExtrudedHeading>` — client component. Real semantic tag + client-built depth layers, all three tiers, budget caps. **Built and proven in isolation before any page uses it.**
2. `<Studio>` — the perspective root: cyclorama, floor, contact shadow, pointer lean.
3. The hill wedge.
4. Section 01, complete, at all three tiers and every breakpoint. **Stop and review here** — if the extrusion does not look right at hero scale, nothing after it matters.
5. Sections 02–05.
6. Audit: reduced motion, keyboard, 360/768/1024/1440/1920, Lighthouse, and a throttled-CPU pass specifically watching paint cost on the depth layers.

---

## 7. Acceptance

- [ ] Served HTML contains each heading exactly **once**; depth layers are client-built and `aria-hidden`.
- [ ] Headings are real, selectable, screen-reader-readable text; `<h1>` remains the LCP element and paints without waiting on JS.
- [ ] Side walls darken toward `--ridge`; every type block has a contact shadow.
- [ ] ≤3 extruded headings, ≤16 layers each, `will-change` cleared after animation.
- [ ] Mobile and coarse pointers render the flat tier — no clones created at all.
- [ ] `prefers-reduced-motion` renders final state at first paint.
- [ ] No per-character animation anywhere.
- [ ] White/green discipline holds: `--ink` and `--green` carry the type, `--accent` stays non-text, no third hue introduced.
- [ ] Logo appears only as the approved lockup (`AGENTS.md` §0.1, still in force).

---

## 8. Open questions

1. **The cyclorama gradient** (§3) — deliberate exception, or hold the no-gradient line and ground the type with the contact shadow alone?
2. **The last 20%** (§2.3) — is CSS-3D's ceiling acceptable, or should the hero specifically become a pre-rendered still with live `sr-only` text? Trade: fidelity vs. CMS-editability.
3. **Does this become the sitewide language?** If `/about` lands well, `/services`, `/sectors` and `/insights` should inherit the studio rather than each inventing a look — and `REDESIGN_BRIEF` §3.4's WebGL `TerrainScene` should probably be dropped entirely rather than kept for those routes.

---

# §9 — SECTIONS 02 & 03

Added after the §01 studio landed. Scanned from the supplied reference frame.

## 9.1 What the reference is doing

**02 — The bigger picture.** Extruded statement on the left at ~45% of the
frame; a rendered sculptural object centre-right standing on the studio
floor; a narrow right column carrying a letterspaced grey eyebrow over two
tight paragraphs. Warm cream cyclorama with a visible floor seam behind the
object.

**03 — Brand DNA.** Extruded statement bottom-left; to its right a
**four-column grid** separated by hairline rules. Each column: a large
rendered numeral (01–04), a small filled green icon beside a bold title, a
letterspaced grey summary in caps, then a body paragraph. Background steps
one shade warmer/darker than 02.

**Details worth naming, because they carry the look:**
- Backgrounds are **warm** off-white and cream, not the site's cool `--canvas`.
- The 02 headline changes colour **mid-line** — "It is" in ink, "short of the
  discipline" in green, on the same line.
- Metadata is uppercase, heavily letterspaced, ~11px, in a muted grey.
- Body copy is small (~15px) and set tight, at roughly 34 characters.
- Column dividers are single hairlines, full height, no boxes, no cards.

## 9.2 Content — already written

The seeded DNA pillars in `scripts/seed-data/dna.ts` match the reference
**word for word**: the four names, the caps summaries and the body paragraphs
are all already in the database. 02 and 03 are a layout and material job, not
a copy job. Nothing here invents content.

## 9.3 The two rendered objects — stated plainly

The mossy sculpture in 02 and the four numerals in 03 are photoreal 3D
renders. **They cannot be produced in CSS, and no image generation is
available here.** Pretending otherwise would mean shipping a weak imitation
of the strongest thing in the frame. The honest split:

- **The 02 sculpture** becomes a real content slot — `about.figure`, an
  optional `Img` rendered through the studio's floor and shadow treatment.
  When absent it falls back to a CSS-3D form, exactly as `PersonCard` falls
  back to a monogram. Drop a render in via the admin and the section is the
  reference.
- **The 03 numerals** are built with the site's own extrusion machinery —
  `<ExtrudedHeading>` numerals in green and ink. Not photoreal, but genuinely
  three-dimensional, consistent with §01, and free. If real renders arrive
  later they replace the numerals through the same slot pattern.

## 9.4 New capability required

`<ExtrudedHeading>` currently tones a whole line at once, because a depth
layer is built from `textContent`. The 02 headline breaks colour mid-line, so
layers must be built by **cloning the face's markup** and re-toning each
segment along its own ramp. Same silhouette and wrapping as the face — it is
the same markup — with per-segment lighting.

## 9.5 Surfaces

The reference's warmth is not the current palette. Two studio-scoped tokens,
documented as belonging to /about's room rather than the brand:
`--studio-warm` (02) and `--studio-warm-deep` (03). `--canvas` is untouched
everywhere else on the site.

## 9.6 Motion

- Statements: the §01 extrusion grow, unchanged.
- The 02 object: slow scroll parallax, drifting against the type.
- 03 columns: staggered reveal; each numeral grows its depth in sequence,
  60ms apart, so the row assembles left to right.
- Dividers: draw down from the top, `scaleY`, behind the column content.
- All of it inherits the §01 tiers — flat below 1024px, final-state under
  reduced motion.
