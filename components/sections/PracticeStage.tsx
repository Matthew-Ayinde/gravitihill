"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { m } from "framer-motion";
import { HudCorners } from "@/components/motion/HudCorners";
import { ScanLine } from "@/components/motion/ScanLine";
import { Spotlight } from "@/components/motion/Spotlight";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { EASE_BRAND } from "@/lib/motion";
import { cn, indexNumber } from "@/lib/utils";
import type { IconName, Img } from "@/lib/schemas";

export type PracticeStageOffering = {
  name: string;
  icon: IconName;
};

export type PracticeStageItem = {
  slug: string;
  name: string;
  proposition: string;
  href: string;
  offerings: PracticeStageOffering[];
  cover?: Img;
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE PRACTICE STAGE — /services' own quiet-immersive moment
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The Sectors panel (§5.2) stays the site's one pinned, scroll-jacked
 * signature. This is deliberately a step down from that: nothing here pins
 * the scrollbar or hijacks native scroll. It is a sticky-in-flow companion —
 * an established, boring-in-the-best-way browser behaviour — carrying three
 * things that already exist elsewhere on the site rather than inventing new
 * gimmicks: `Tilt3D`'s pointer lean, `HudCorners`' instrumentation brackets,
 * and `ScanLine`'s sweep, all part of the secondary-route "ambient system
 * layer" already in use on this page.
 *
 * What is new here is the typography: the active practice's name lives on a
 * spectrum between the dimmed rest state (wdth 88 / wght 500) and the full
 * `type-display` role (wdth 72 / wght 700), crossing it live via
 * `font-variation-settings` as a plain CSS transition rather than a class
 * swap — the width axis *is* the emphasis mechanism, which is the entire
 * reason this brief specified a variable font in the first place.
 *
 * The offerings list opens with a CSS grid-rows accordion (0fr → 1fr), not a
 * JS height:auto measurement — no layout thrash, and it degrades to nothing
 * (transition-duration collapses to ~0 globally) under reduced motion without
 * any extra branching in this file.
 *
 * Below 1024px, and under `prefers-reduced-motion: reduce` at any width, the
 * hover-gated stage does not exist at all: `<MobileStack>` renders every
 * practice already open, image inline, in normal document flow — the same
 * "a different layout, not a smaller version" rule the Sectors panel itself
 * follows.
 */
export function PracticeStage({ items }: { items: PracticeStageItem[] }) {
  return (
    <>
      <DesktopStage items={items} />
      <MobileStack items={items} />
    </>
  );
}

/* ══ Desktop: row list + sticky companion ═════════════════════════════════ */

function DesktopStage({ items }: { items: PracticeStageItem[] }) {
  const [active, setActive] = useState(0);
  const total = items.length;
  const activeItem = items[active];

  return (
    <div className="relative hidden motion-safe:lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="relative lg:col-span-7">
        <Spotlight tone="light" size={560} />
        <ul className="border-t border-rule">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative flex flex-col gap-5 border-b border-rule py-9 pl-7 transition-colors duration-200 ease-brand hover:bg-canvas-alt focus-visible:bg-canvas-alt"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-2 bottom-2 left-0 w-0.5 origin-center bg-accent transition-transform duration-300 ease-brand"
                    style={{ transform: isActive ? "scaleY(1)" : "scaleY(0)" }}
                  />

                  <div className="flex items-baseline gap-5">
                    <span
                      className={cn(
                        "type-eyebrow transition-colors duration-300 ease-brand",
                        isActive ? "text-green" : "text-ink-muted",
                      )}
                    >
                      {indexNumber(i)}
                    </span>
                    <span
                      className="type-display block text-h2 transition-[font-variation-settings,font-weight,color,opacity] duration-500 ease-brand"
                      style={
                        isActive
                          ? { color: "var(--green)" }
                          : {
                              fontVariationSettings: `"wdth" var(--wdth-semicond)`,
                              fontWeight: 500,
                              color: "var(--ink)",
                              opacity: 0.45,
                            }
                      }
                    >
                      {item.name}
                    </span>
                  </div>

                  <p className="measure text-body-lg text-ink-muted">
                    {item.proposition}
                  </p>

                  {/* Offerings accordion — a CSS grid-rows transition, not a
                      measured height:auto, so there is no layout thrash and
                      reduced motion collapses it for free via the sitewide
                      transition-duration reset. */}
                  <div
                    className="grid transition-[grid-template-rows] duration-500 ease-brand"
                    style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
                        {item.offerings.map((offering) => (
                          <li
                            key={offering.name}
                            className="type-eyebrow flex items-center gap-2.5 text-ink-muted"
                          >
                            <Icon
                              name={offering.icon}
                              className="h-4 w-4 shrink-0 text-green"
                            />
                            {offering.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="type-eyebrow flex items-center justify-between text-ink-muted">
                    {item.offerings.length} services
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-200 ease-brand group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <Tilt3D
            max={4}
            scale={1.015}
            className="relative aspect-4/5 w-full overflow-hidden bg-canvas-alt"
          >
            {items.map((item, i) => (
              <m.div
                key={item.slug}
                data-motion
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: i === active ? 1 : 0,
                  scale: i === active ? 1 : 1.04,
                }}
                transition={{ duration: 0.7, ease: EASE_BRAND }}
              >
                {item.cover ? (
                  <>
                    <Image
                      src={item.cover.src}
                      alt={item.cover.alt}
                      fill
                      sizes="(min-width: 1024px) 38vw, 100vw"
                      priority={i === 0}
                      className="object-cover"
                      {...(item.cover.blurDataURL
                        ? {
                            placeholder: "blur" as const,
                            blurDataURL: item.cover.blurDataURL,
                          }
                        : {})}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-ridge/10"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-canvas-alt">
                    <span className="type-display text-h1 text-green/15">
                      {indexNumber(i)}
                    </span>
                  </div>
                )}
              </m.div>
            ))}
            <HudCorners tone="light" size={28} />
            <ScanLine tone="light" duration={9} className="opacity-60" />
          </Tilt3D>

          <div className="mt-5 flex items-baseline justify-between">
            <p className="type-eyebrow text-ink-muted">
              <span className="text-green">{indexNumber(active)}</span>
              <span aria-hidden="true"> / </span>
              {String(total).padStart(2, "0")}
            </p>
            <p className="type-eyebrow text-ink-muted">{activeItem.name}</p>
          </div>

          <div className="mt-3 h-px w-full bg-rule">
            <m.div
              data-motion
              className="h-px origin-left bg-accent"
              animate={{ scaleX: (active + 1) / total }}
              transition={{ duration: 0.5, ease: EASE_BRAND }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ Mobile & reduced motion: stacked, everything already open ═══════════ */

function MobileStack({ items }: { items: PracticeStageItem[] }) {
  return (
    <div className="motion-safe:lg:hidden">
      <RevealGroup as="ul" className="border-t border-rule">
        {items.map((item, i) => (
          <RevealItem as="li" key={item.slug}>
            <Link href={item.href} className="group block border-b border-rule py-10">
              <div className="flex items-baseline gap-5">
                <span className="type-eyebrow text-ink-muted">
                  {indexNumber(i)}
                </span>
                <h3 className="type-display text-h2">{item.name}</h3>
              </div>

              {item.cover ? (
                <div className="relative mt-6 aspect-4/5 w-full overflow-hidden bg-canvas-alt">
                  <Image
                    src={item.cover.src}
                    alt={item.cover.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    {...(item.cover.blurDataURL
                      ? {
                          placeholder: "blur" as const,
                          blurDataURL: item.cover.blurDataURL,
                        }
                      : {})}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-ridge/10" />
                </div>
              ) : null}

              <p className="measure mt-6 text-body-lg text-ink-muted">
                {item.proposition}
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {item.offerings.map((offering) => (
                  <li
                    key={offering.name}
                    className="type-eyebrow flex items-center gap-2 text-ink-muted"
                  >
                    <Icon name={offering.icon} className="h-4 w-4 text-green" />
                    {offering.name}
                  </li>
                ))}
              </ul>

              <p className="type-eyebrow mt-6 flex items-center gap-3 text-ink-muted">
                {item.offerings.length} services
                <span aria-hidden="true">→</span>
              </p>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
