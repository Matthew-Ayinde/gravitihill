"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE_BRAND } from "@/lib/motion";
import { indexNumber } from "@/lib/utils";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * THE SIGNATURE INTERACTION
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A full-viewport panel that pins while the reader scrolls through three
 * states: Consumer → B2B → Technology. It is the site's one flagship bold
 * moment — everything else on the page stays quiet so this can be noticed.
 *
 * ── The image is the section ─────────────────────────────────────────────
 * Each sector's photograph is the panel's background, edge to edge, not an
 * illustration boxed alongside the copy. The index (numerals + names) and
 * the proposition/approach points sit on top of it as one static foreground
 * layer, on a flat --abyss tint strong enough to guarantee legibility
 * against whatever the photograph is doing underneath.
 *
 * ── Morphing, not cutting ─────────────────────────────────────────────────
 * All three backgrounds stay mounted, stacked in the same box, and the whole
 * crossfade is one GSAP timeline scrubbed by a single ScrollTrigger. One
 * layer dissolves down while the next dissolves up and settles from a slight
 * zoom — a continuous cross-fade that tracks the scrollbar exactly (scroll a
 * pixel, the blend moves a pixel; stop, it stops; reverse, it reverses),
 * rather than a hard cut at each third.
 *
 * The "scroll smoothly" requirement is already handled site-wide: MotionRoot
 * mounts Lenis, and SmoothScroll drives it from gsap.ticker with
 * ScrollTrigger.update bound to Lenis's own scroll event. The timeline below
 * therefore rides an already-eased scroll position — `scrub: true`, not a
 * numeric scrub, because adding a second smoothing pass on top of that would
 * only put lag between the reader's input and the pixels.
 *
 * Mechanics
 * ---------
 * · One ScrollTrigger over a 340vh container ("top top" → "bottom bottom")
 *   scrubs one timeline. Each layer's fade/scale is placed on that timeline
 *   at its own third, so there is no per-frame JS: GSAP interpolates.
 * · The active index (for the numeral list, aria-current and the copy swap)
 *   is discrete: read from the same trigger's `progress` in onUpdate and
 *   mirrored into React state only when the integer actually changes, so
 *   scrolling does not re-render the tree on every frame.
 * · Pinning is `position: sticky` on the inner viewport-height wrapper —
 *   deliberately *not* ScrollTrigger's own `pin`. Sticky is a browser
 *   behaviour that costs nothing and cannot desynchronise from the scroll
 *   position; ScrollTrigger's pin re-parents the element into a wrapper and
 *   has to be re-measured on every refresh, which is a whole class of bug
 *   (and jump-on-refresh) this panel simply never has.
 *
 * Why this takes rendered nodes rather than the content module
 * -----------------------------------------------------------
 * This file is a client boundary. Importing content/sectors.ts here pulled the
 * module — and Zod with it — into the home route's first-load JS, which cost
 * ~63 kB gzipped for data the server had already rendered. The server wrapper
 * (SectorsSection) does the reading and hands over finished elements; only the
 * slug, name and proposition cross as strings, because the interaction needs
 * to key and link on them.
 *
 * A deliberate cost: all three backgrounds — not just the active one — stay
 * mounted for the life of the pin, because a continuous morph needs the
 * outgoing and incoming frame present at every point in between. For three
 * sector images this is a fair trade for a signature moment; it would not be
 * for a longer list.
 *
 * Degradation — a different layout, not a smaller pin
 * --------------------------------------------------
 * Below 1024px, and at any width under `prefers-reduced-motion: reduce`, the
 * pin does not exist: three stacked panels with the site's standard reveals.
 * The switch is pure CSS (`hidden motion-safe:lg:block` against
 * `motion-safe:lg:hidden`), so there is no hydration flash and no JS gate —
 * and because `display: none` removes a subtree from the accessibility tree,
 * assistive technology only ever encounters one of the two.
 */

export type SectorPanelItem = {
  slug: string;
  name: string;
  href: string;
  proposition: string;
  /** Pre-rendered on the server: the full-bleed image or its typographic stand-in. */
  visual: ReactNode;
  /** Pre-rendered on the server: one node per strategic-approach point. */
  points: ReactNode[];
};

const PANEL_HEIGHT = "h-[340vh]";

export function SectorsPanel({
  items,
  index = "04",
}: {
  items: SectorPanelItem[];
  index?: string;
}) {
  return (
    <section
      id="sectors"
      aria-labelledby="sectors-panel-heading"
      // --abyss, not --ridge: the site's three dark moments (this,
      // The Naked Board, Contact) used to be one identical fill. This one
      // now sits a plane deeper, so the rhythm reads as two depths rather
      // than a single dark colour reused three times.
      className="bg-abyss text-white"
    >
      <h2 id="sectors-panel-heading" className="sr-only">
        Sectors
      </h2>
      <PinnedPanel items={items} index={index} />
      <StackedPanels items={items} index={index} />
    </section>
  );
}

/* ══ Desktop: the pinned panel ════════════════════════════════════════════ */

function PinnedPanel({
  items,
  index,
}: {
  items: SectorPanelItem[];
  index: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const total = items.length;

  // ── The scrubbed crossfade ───────────────────────────────────────────
  useGSAP(
    () => {
      if (!container.current) return;

      const layers = gsap.utils.toArray<HTMLElement>(
        "[data-sector-layer]",
        container.current,
      );
      if (layers.length === 0) return;

      // Rest state: the first layer is the one on screen when the panel is
      // entered; the rest wait at zero.
      layers.forEach((layer, i) => {
        gsap.set(layer, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.08 });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const next = Math.min(
              total - 1,
              Math.max(0, Math.floor(self.progress * total)),
            );
            setActive((current) => (current === next ? current : next));
          },
        },
      });

      // Each layer owns one third of the timeline, fading in over the first
      // 30% of its own third and out over the last 30% — the first has no
      // entrance and the last no exit, so the panel opens and closes on a
      // settled frame rather than a half-dissolved one.
      const segment = 1 / total;
      layers.forEach((layer, i) => {
        const start = i * segment;
        const end = start + segment;

        if (i > 0) {
          timeline.fromTo(
            layer,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, ease: "none", duration: segment * 0.3 },
            start,
          );
        }
        if (i < total - 1) {
          timeline.to(
            layer,
            { opacity: 0, scale: 0.94, ease: "none", duration: segment * 0.3 },
            end - segment * 0.3,
          );
        }
      });

      // The progress rule along the bottom edge, on the same scrub.
      timeline.fromTo(
        "[data-sector-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: 1 },
        0,
      );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { dependencies: [total], scope: container },
  );

  // ── The accent marker slides to the active row ───────────────────────
  // Offsets are measured rather than assumed: the index type is fluid, so a
  // hardcoded row height would drift at every width between 1024 and 1920px.
  useGSAP(
    () => {
      const move = () => {
        const row = listRef.current?.children[active] as HTMLElement | undefined;
        if (!row || !markerRef.current) return;
        gsap.to(markerRef.current, {
          y: row.offsetTop + row.offsetHeight / 2,
          duration: 0.5,
          ease: EASE_BRAND,
        });
      };

      move();
      window.addEventListener("resize", move);
      return () => window.removeEventListener("resize", move);
    },
    { dependencies: [active], scope: container },
  );

  // ── The copy swap ────────────────────────────────────────────────────
  // Enter-only. The outgoing copy is replaced by React the moment `active`
  // changes; animating it out first would mean holding two propositions in
  // the same box, which at this type size is unreadable rather than elegant.
  useGSAP(
    () => {
      if (!copyRef.current) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line-inner]", copyRef.current);
      if (lines.length === 0) return;

      gsap.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.6, stagger: 0.06, ease: EASE_BRAND },
      );
    },
    { dependencies: [active], scope: container },
  );

  const sector = items[active];

  return (
    <div
      ref={container}
      className={`relative hidden motion-safe:lg:block ${PANEL_HEIGHT}`}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Background: the section itself, morphing ─────────────────
            All three sector photographs stay mounted here, each one's
            opacity/scale a pure function of scroll progress — see the file
            header. This is the one full-bleed surface everything else in
            the panel sits on top of. */}
        <div className="perspective-scene absolute inset-0">
          {items.map((item) => (
            <div key={item.slug} data-sector-layer className="absolute inset-0">
              {item.visual}
            </div>
          ))}
        </div>

        {/* Tint: legibility for the numerals and copy riding on top, not
            decoration — a flat --abyss over the whole frame, then a second,
            stronger pass behind the copy block specifically. Every sector's
            photograph gets the same treatment, so a mismatched library still
            reads as one section rather than three different backdrops. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-abyss/55"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-abyss/95 via-abyss/45 to-transparent"
        />

        {/* ── Foreground: index + copy, static, never morphs ───────────── */}
        <div className="relative z-10 flex h-full flex-col">
          <p className="type-eyebrow shell pt-10 text-white/45">
            <span className="accent-word-dark">{index}</span>
            <span aria-hidden="true" className="mx-2">
              —
            </span>
            Sectors
          </p>

          <div className="flex flex-1">
            {/* Index: the one thing on screen the reader can always read
                against while the background behind it keeps changing. Set at
                hero scale — "large display-set numerals" per the brief — so
                the index reads as the room's dominant shape, not a caption
                beside the photograph. */}
            <div className="flex w-full shrink-0 flex-col justify-center pl-gutter pr-6 lg:w-[42%] xl:w-[38%]">
              <div className="relative">
                <span
                  ref={markerRef}
                  aria-hidden="true"
                  className="absolute -left-6 block h-px w-8 bg-accent"
                />

                <ul ref={listRef}>
                  {items.map((item, i) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onFocus={() => setActive(i)}
                        aria-current={i === active ? "true" : undefined}
                        className="flex items-end gap-4 py-2"
                      >
                        {/* Opacity is a CSS transition, not a tween: it is a
                            two-state change driven by React state, and a
                            transition costs nothing to set up where a tween
                            per row per scroll-third would. */}
                        <span
                          className="type-display text-h3 leading-none tabular-nums transition-opacity duration-400 ease-brand"
                          style={{ opacity: i === active ? 0.6 : 0.2 }}
                        >
                          {indexNumber(i)}
                        </span>
                        <span
                          className="type-display text-hero leading-none transition-opacity duration-400 ease-brand"
                          style={{ opacity: i === active ? 1 : 0.28 }}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copy: proposition + approach points, bottom-anchored over
                the background's own foot. Capped to its own measure rather
                than stretched across the remaining width — asymmetry, not a
                dead-centred caption — so it reads as a second, deliberate
                statement rather than a footnote to the index. */}
            <div className="flex max-w-2xl flex-1 flex-col justify-end px-10 pb-16 lg:pb-24 xl:px-14">
              <div ref={copyRef} key={sector.slug}>
                <MaskedLine>
                  <p className="type-display text-h2 text-white">
                    {sector.proposition}
                  </p>
                </MaskedLine>

                <ul className="mt-9 space-y-4">
                  {sector.points.map((point, i) => (
                    <MaskedLine key={i} as="li">
                      <span className="text-body-lg">{point}</span>
                    </MaskedLine>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Progress rule ───────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-rule-dark">
          <div
            data-sector-progress
            className="h-px origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * One clipped line whose inner span translates up. Line-level, never
 * per-character.
 *
 * Holds no animation of its own — the panel's copy-swap effect queries these
 * inner spans and staggers them as a single tween, so a line is just markup
 * plus a marker attribute.
 */
function MaskedLine({
  children,
  as: Tag = "div",
}: {
  children: ReactNode;
  as?: "div" | "li";
}) {
  return (
    <Tag className="line-mask">
      <span data-line-inner data-motion className="block">
        {children}
      </span>
    </Tag>
  );
}

/* ══ Mobile & reduced motion: three stacked panels ════════════════════════ */

function StackedPanels({
  items,
  index,
}: {
  items: SectorPanelItem[];
  index: string;
}) {
  return (
    <div className="py-section motion-safe:lg:hidden">
      <div className="shell">
        <p className="type-eyebrow mb-12 text-white/45">
          <span className="accent-word-dark">{index}</span>
          <span aria-hidden="true" className="mx-2">
            —
          </span>
          Sectors
        </p>

        <ul className="space-y-20">
          {items.map((sector, i) => (
            <li key={sector.slug}>
              <Link href={sector.href} className="block">
                <div className="flex items-baseline gap-5">
                  <span className="type-eyebrow text-accent">
                    {indexNumber(i)}
                  </span>
                  <h3 className="type-display text-hero leading-none text-white">
                    {sector.name}
                  </h3>
                </div>

                <div className="relative mt-8 aspect-4/5 w-full overflow-hidden">
                  {sector.visual}
                </div>

                <p className="type-display mt-8 text-h2 text-white">
                  {sector.proposition}
                </p>

                <ul className="mt-7 space-y-4">
                  {sector.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-body-lg">
                      {point}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
