"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
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
 * All three backgrounds stay mounted, stacked in the same box, and each
 * one's opacity and scale is a pure `useTransform` curve over its own third
 * of scroll progress (`edgeCurve`). One dissolves down while the next
 * dissolves up and settles from a slight zoom — a continuous cross-fade that
 * scrubs exactly with the scrollbar (scroll a pixel, the blend moves a
 * pixel; stop, it stops; reverse, it reverses), rather than a hard cut
 * driven by React state at each third.
 *
 * The "scroll smoothly" requirement is already handled site-wide: MotionRoot
 * mounts Lenis, which eases the real scroll position (not a virtualised
 * transform) on every route. `scrollYProgress` here already rides that eased
 * curve, so the backgrounds read it raw — stacking a second spring on top of
 * an already-smoothed value would just add a layer of lag between the
 * reader's scroll and what they see, trading connectedness for no real gain.
 *
 * Mechanics
 * ---------
 * · `useScroll` with offset ['start start', 'end end'] over a 340vh container
 *   gives `scrollYProgress` — already Lenis-eased — which every layer below
 *   reads directly as `progress`.
 * · Each background's opacity/scale comes from `useTransform` over its own
 *   third of `progress`, via `edgeCurve` — no AnimatePresence, no direction
 *   state, no React re-render on scroll.
 * · The active index (for the numeral list, aria-current and the copy swap)
 *   is still discrete: derived from the same `progress`, mirrored into React
 *   state only when the integer changes.
 * · Pinning is `position: sticky` on the inner viewport-height wrapper. No
 *   scroll-jacking library, no wheel handlers — the reader keeps native
 *   scroll behaviour and a truthful scrollbar throughout.
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

/* ══ A local curve builder ══════════════════════════════════════════════════
 * Every scroll-driven layer below shares the same shape: hold at `rest`,
 * ease in from `enter` over the first 30% of its own local range if it isn't
 * the first item, ease out to `exit` over the last 30% if it isn't the last.
 * Kept generic over item count rather than hardcoded to three sectors. */
function edgeCurve(
  hasIn: boolean,
  hasOut: boolean,
  enter: number,
  rest: number,
  exit: number,
): [number[], number[]] {
  const points: number[] = [0];
  const values: number[] = [hasIn ? enter : rest];
  if (hasIn) {
    points.push(0.3);
    values.push(rest);
  }
  if (hasOut) {
    points.push(0.7);
    values.push(rest);
  }
  points.push(1);
  values.push(hasOut ? exit : rest);
  return [points, values];
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
  const [active, setActive] = useState(0);
  const [markerY, setMarkerY] = useState(0);

  // Already Lenis-eased — see the file header. Every scroll-driven layer
  // below reads this one value.
  const { scrollYProgress: progress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const activeIndex = useTransform(progress, (value) =>
    Math.min(items.length - 1, Math.max(0, Math.floor(value * items.length))),
  );

  useMotionValueEvent(activeIndex, "change", (value) => {
    setActive((current) => (current === value ? current : value));
  });

  // The accent marker slides to the active row. Offsets are measured rather
  // than assumed: the index type is fluid, so a hardcoded row height would
  // drift at every width between 1024px and 1920px.
  useEffect(() => {
    const measure = () => {
      const row = listRef.current?.children[active] as HTMLElement | undefined;
      if (!row) return;
      setMarkerY(row.offsetTop + row.offsetHeight / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

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
          {items.map((item, i) => (
            <SectorVisualLayer
              key={item.slug}
              item={item}
              index={i}
              total={items.length}
              progress={progress}
            />
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
                against while the background behind it keeps changing. */}
            <div className="flex w-full shrink-0 flex-col justify-center pl-gutter pr-10 lg:w-[36%] xl:w-[30%]">
              <div className="relative">
                <m.span
                  aria-hidden="true"
                  className="absolute -left-4 block h-px w-6 bg-accent"
                  animate={{ y: markerY }}
                  transition={{ duration: 0.5, ease: EASE_BRAND }}
                />

                <ul ref={listRef}>
                  {items.map((item, i) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onFocus={() => setActive(i)}
                        aria-current={i === active ? "true" : undefined}
                        className="flex items-baseline gap-6 py-3"
                      >
                        <m.span
                          className="type-eyebrow"
                          animate={{ opacity: i === active ? 1 : 0.28 }}
                          transition={{ duration: 0.4, ease: EASE_BRAND }}
                        >
                          {indexNumber(i)}
                        </m.span>
                        <m.span
                          className="type-display text-h1"
                          animate={{ opacity: i === active ? 1 : 0.28 }}
                          transition={{ duration: 0.4, ease: EASE_BRAND }}
                        >
                          {item.name}
                        </m.span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copy: proposition + approach points, bottom-anchored over
                the background's own foot. */}
            <div className="measure flex flex-1 flex-col justify-end px-10 pb-14 lg:pb-16">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={sector.slug}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                    exit: { opacity: 0, transition: { duration: 0.18 } },
                  }}
                >
                  <MaskedLine>
                    <p className="type-display text-h3 text-white">
                      {sector.proposition}
                    </p>
                  </MaskedLine>

                  <ul className="mt-6 space-y-2.5">
                    {sector.points.map((point, i) => (
                      <MaskedLine key={i} as="li">
                        {point}
                      </MaskedLine>
                    ))}
                  </ul>
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Progress rule ───────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-rule-dark">
          <m.div
            className="h-px origin-left bg-accent"
            style={{ scaleX: progress }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * One sector's background, permanently mounted and blended purely by scroll
 * progress. `local` re-maps the shared `progress` value onto this item's own
 * third of the range as 0→1, and `edgeCurve` turns that into a dissolve-and-
 * settle: it eases in from a slight zoom at the start (skipped for the first
 * item) and dissolves out to a slight zoom at the end (skipped for the
 * last) — a Ken-Burns-style morph rather than a rotation or a hard cut.
 */
function SectorVisualLayer({
  item,
  index,
  total,
  progress,
}: {
  item: SectorPanelItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const local = useTransform(progress, [start, end], [0, 1]);

  const hasIn = index > 0;
  const hasOut = index < total - 1;

  const opacity = useTransform(local, ...edgeCurve(hasIn, hasOut, 0, 1, 0));
  const scale = useTransform(local, ...edgeCurve(hasIn, hasOut, 1.08, 1, 0.94));

  return (
    <m.div style={{ opacity, scale }} className="absolute inset-0">
      {item.visual}
    </m.div>
  );
}

/** One clipped line whose inner span translates up. Line-level, never per-character. */
function MaskedLine({
  children,
  as = "div",
}: {
  children: ReactNode;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? m.li : m.div;
  return (
    <Tag className="line-mask">
      <m.span
        data-motion
        className="block"
        variants={{
          hidden: { y: "110%" },
          visible: { y: "0%", transition: { duration: 0.6, ease: EASE_BRAND } },
        }}
      >
        {children}
      </m.span>
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
                  <h3 className="type-display text-h1 text-white">
                    {sector.name}
                  </h3>
                </div>

                <div className="relative mt-8 aspect-4/5 w-full overflow-hidden">
                  {sector.visual}
                </div>

                <p className="type-display mt-8 text-h3 text-white">
                  {sector.proposition}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {sector.points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
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
