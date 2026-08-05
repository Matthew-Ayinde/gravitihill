"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { EASE_BRAND } from "@/lib/motion";
import { indexNumber } from "@/lib/utils";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * THE SIGNATURE INTERACTION
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A full-viewport --ridge panel that pins while the reader scrolls through
 * three states: Consumer → B2B → Technology. It is the one bold moment on the
 * site; nothing else is allowed to compete with it.
 *
 * Mechanics
 * ---------
 * · `useScroll` with offset ['start start', 'end end'] over a 300vh container.
 * · `useTransform` derives the active index from that progress; a motion-value
 *   subscription mirrors it into React state only when the integer changes, so
 *   scrolling does not re-render on every frame.
 * · Pinning is `position: sticky` on the inner viewport-height wrapper. No
 *   scroll-jacking library, no wheel handlers — the reader keeps native scroll
 *   behaviour and a truthful scrollbar throughout.
 * · `AnimatePresence` swaps the content. Default (sync) presence for the
 *   visual so the two states overlap into a real crossfade; `mode="wait"` for
 *   the copy, where an overlap would be two headlines on top of each other.
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
  /** Pre-rendered on the server: the image or its typographic stand-in. */
  visual: ReactNode;
  /** Pre-rendered on the server: one node per strategic-approach point. */
  points: ReactNode[];
};

const PANEL_HEIGHT = "h-[300vh]";

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
      className="bg-ridge text-white"
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
  const [active, setActive] = useState(0);
  const [markerY, setMarkerY] = useState(0);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Progress → active index. Clamped so the final sector holds at progress 1
  // rather than flicking out of range on the last pixel.
  const activeIndex = useTransform(scrollYProgress, (value) =>
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
        <div className="shell flex h-full flex-col justify-center pt-20 pb-14">
          <p className="type-eyebrow mb-10 text-white/45">
            <span className="accent-word-dark">{index}</span>
            <span aria-hidden="true" className="mx-2">
              —
            </span>
            Sectors
          </p>

          <div className="grid-12 items-center gap-y-10">
            {/* ── Index ─────────────────────────────────────────────── */}
            <div className="relative col-span-5">
              <m.span
                aria-hidden="true"
                className="absolute -left-8 block h-px w-6 bg-accent"
                animate={{ y: markerY }}
                transition={{ duration: 0.5, ease: EASE_BRAND }}
              />

              <ul ref={listRef}>
                {items.map((item, i) => (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      onFocus={() => setActive(i)}
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

            {/* ── Visual + copy ─────────────────────────────────────── */}
            <div className="col-span-6 col-start-7">
              <div className="relative aspect-3/2 w-full overflow-hidden">
                <AnimatePresence initial={false}>
                  <m.div
                    key={sector.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: EASE_BRAND }}
                  >
                    {sector.visual}
                  </m.div>
                </AnimatePresence>
              </div>

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
                  className="mt-9"
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-rule-dark">
          <m.div
            className="h-px origin-left bg-accent"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </div>
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

                <div className="mt-8">{sector.visual}</div>

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
