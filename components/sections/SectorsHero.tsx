import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Entrance } from "@/components/motion/Entrance";
import { SectorsHeroScene } from "@/components/sections/SectorsHeroScene";
import type { Sector } from "@/lib/schemas";
import { indexNumber } from "@/lib/utils";

/**
 * /sectors — the opening.
 *
 * Two registers on one screen: a type-led statement set into a visible
 * 12-column grid, and a triptych of the three sectors directly under it.
 * Each shutter is a link to its sector's page, and hovering one opens it
 * wider to show the proposition and what sets the sector apart (its
 * differentiators).
 *
 * ── The page's division of content ───────────────────────────────────────
 * This hero is the only place on /sectors that shows the sector
 * photographs, propositions and differentiators. <SectorApproach> below
 * carries the thesis and approach steps and nothing from here — keep it that
 * way when either changes.
 *
 * A server component. Copy, images and links render here; <SectorsHeroScene>
 * is the one client island and only moves what this file has already drawn.
 *
 * ── LCP ──────────────────────────────────────────────────────────────────
 * The <h1> paints with the document. The shutter photographs load eagerly
 * because they sit above the fold at every desktop height, and are
 * decorative inside links whose text carries the meaning (alt="").
 */
export function SectorsHero({
  sectors,
  lede,
}: {
  sectors: Sector[];
  lede: string;
}) {
  return (
    <SectorsHeroScene
      labelledBy="sectors-hero-heading"
      className="bg-canvas pt-32 pb-16 lg:pt-36 lg:pb-24"
    >
      <HeroGrid />

      <Entrance className="shell relative z-10" delay={0.1}>
        <div className="flex items-center justify-between gap-6">
          <p data-load className="type-eyebrow flex items-center gap-2.5 text-green">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
            />
            Sectors
          </p>
          <p data-load className="type-eyebrow hidden text-ink-muted sm:block">
            Lagos / West Africa
          </p>
        </div>

        {/* Each line drifts on an outer wrapper and wipes in on an inner one,
            so the scroll transform and the entrance transform never write to
            the same element. */}
        <h1
          id="sectors-hero-heading"
          className="type-display mt-8 text-hero lg:mt-10 lg:text-display-xl"
        >
          <span data-drift="-1" className="block">
            <span data-load="mask" className="block text-ink-display">
              Three sectors.
            </span>
          </span>
          <span data-drift="1" className="block">
            <span data-load="mask" className="block text-ink-display">
              Three <span className="text-green">arguments.</span>
            </span>
          </span>
        </h1>

        <div className="relative mt-10 pt-8 lg:mt-12 lg:pt-8">
          <span aria-hidden="true" className="hero-rule absolute inset-x-0 top-0 h-px bg-rule" />

          <div className="grid-12 gap-y-8">
            <p
              data-load
              className="measure col-span-12 text-body-lg text-ink-muted lg:col-span-6 lg:col-start-7"
            >
              {lede}
            </p>

            <div data-load className="col-span-12 lg:col-span-5 lg:row-start-1 lg:self-end">
              <a
                href="#approach"
                className="type-eyebrow group inline-flex items-center gap-4 text-ink-muted transition-colors duration-200 ease-brand hover:text-green"
              >
                <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-rule">
                  <span className="scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-green" />
                </span>
                <span className="link-draw">How the work is run</span>
              </a>
            </div>
          </div>
        </div>
      </Entrance>

      <div className="shell relative z-10 mt-10 lg:mt-12">
        <h2 className="sr-only">The sectors</h2>
        <ul
          data-shutter-list
          className="shutters -mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter lg:mx-0 lg:h-[68vh] lg:max-h-184 lg:min-h-120 lg:snap-none lg:overflow-visible lg:px-0"
        >
          {sectors.map((sector, i) => (
            <Shutter key={sector.slug} sector={sector} position={i} />
          ))}
        </ul>
      </div>
    </SectorsHeroScene>
  );
}

/**
 * One panel of the triptych.
 *
 * Layer order, back to front: photograph (or its numeral plate), the site's
 * --ridge grade, a legibility scrim under the type, the sibling dim, the
 * accent rule, then the type. Everything but the type is aria-hidden.
 */
function Shutter({ sector, position }: { sector: Sector; position: number }) {
  const image = sector.image;

  return (
    <li
      data-shutter
      className="shutter relative aspect-4/5 w-[82%] shrink-0 snap-start overflow-hidden rounded-sm bg-ridge sm:w-[46%] lg:aspect-auto lg:h-full lg:w-auto"
    >
      <Link
        href={`/sectors/${sector.slug}`}
        className="relative block h-full text-white focus-visible:-outline-offset-4"
      >
        <div data-shutter-media aria-hidden="true" className="absolute inset-x-0 inset-y-[-8%]">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              loading="eager"
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 46vw, 82vw"
              className="shutter-img object-cover"
              {...(image.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                : {})}
            />
          ) : (
            <span className="shutter-img type-display absolute inset-0 flex items-center justify-center text-numeral text-white/8">
              {indexNumber(position)}
            </span>
          )}
        </div>

        <div aria-hidden="true" className="absolute inset-0 bg-ridge/14" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-abyss/90 via-abyss/55 to-transparent lg:h-3/4 lg:via-abyss/40"
        />
        <div aria-hidden="true" className="shutter-dim absolute inset-0 bg-abyss" />
        <span aria-hidden="true" className="shutter-rule absolute inset-x-0 top-0 h-0.5 bg-accent" />

        <div
          data-shutter-content
          className="relative flex h-full flex-col justify-between p-6 lg:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <span aria-hidden="true" className="type-eyebrow text-accent">
              {indexNumber(position)}
            </span>
            <span
              aria-hidden="true"
              className="shutter-arrow flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35"
            >
              →
            </span>
          </div>

          <div>
            <h3 className="type-display whitespace-nowrap text-h2 leading-none">
              {sector.name}
            </h3>

            <div className="shutter-detail">
              <div>
                <div className="shutter-detail-inner pt-4 lg:pt-5">
                  <p className="type-subhead text-body-lg text-white/85">
                    {sector.proposition}
                  </p>
                  <ul className="mt-4 flex flex-col gap-y-1.5 border-t border-rule-dark pt-3 lg:mt-5 lg:flex-row lg:flex-wrap lg:gap-x-6 lg:gap-y-2 lg:pt-4">
                    {sector.differentiators.map((item) => (
                      <li key={item.name} className="text-caption text-white/70 lg:type-eyebrow lg:text-white/60">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

/**
 * The layout grid, drawn. Twelve columns matching the shell exactly, so the
 * headline visibly sets against the same grid the whole site is built on.
 * The lines draw down on load in pure CSS; <SectorsHeroScene> lights the
 * column under the pointer. Desktop only — at phone width twelve lines are
 * texture, not structure.
 */
function HeroGrid() {
  return (
    <div
      aria-hidden="true"
      className="hero-grid pointer-events-none absolute inset-x-0 top-28 bottom-0 hidden lg:block"
    >
      <div className="shell grid-12 h-full">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            data-hero-col
            className="hero-col relative h-full"
            style={{ "--i": i } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
