import type { ReactNode } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { HudCorners } from "@/components/motion/HudCorners";
import { ImageCluster } from "@/components/motion/ImageCluster";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { ScanLine } from "@/components/motion/ScanLine";
import type { Img } from "@/lib/schemas";
import { leadingInt } from "@/lib/utils";

/**
 * The /about hero.
 *
 * PageHero.tsx is shared by every other secondary route (Services, Sectors,
 * Insights, Contact) and stays exactly as it is — this is a sibling, not an
 * edit to it, so nothing else on the site is affected. About gets its own
 * variant because it's the one route where a quiet documentary-photo element
 * earns its place: the page is about the firm itself, the way the homepage
 * hero already pairs its headline with a photo cluster.
 *
 * Same discipline as that homepage cluster (see ImageCluster's own comment):
 * the H1 stays plain, instant text — the LCP element, never animated, same
 * reasoning as PageHero. Only the imagery carries the tilt/parallax texture,
 * and that texture is already established site language, not a second
 * signature moment competing with the Sectors panel (§5.2).
 *
 * Layout relies on the same auto-placement PageHero already leans on: the
 * heading and the photo column share row one (the grid growing to the
 * taller item). The facts index sits directly under the heading, in the
 * same column — not under the photo — because the 4:5 image is taller than
 * the heading text, and stacking the facts there is what fills that gap
 * rather than leaving it as dead space above the lede's row.
 */
export function AboutHero({
  eyebrow,
  title,
  lede,
  index,
  heroImages,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Editorial data for the photo column — label/value pairs, not stat cards. */
  index?: ReadonlyArray<{ label: string; value: string }>;
  heroImages: Img[];
}) {
  const hasCluster = heroImages.length >= 2;

  return (
    <section className="pt-36 pb-20 lg:pt-44 lg:pb-28 2xl:pt-56 2xl:pb-32">
      <div className="shell grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <p className="type-eyebrow text-green">{eyebrow}</p>
          <h1 className="type-display mt-6 text-h1 text-ink">{title}</h1>

          {index && index.length > 0 && (
            <RevealGroup as="dl" className="mt-10 max-w-md lg:mt-14" stagger={0.06}>
              {index.map((item) => {
                const n = leadingInt(item.value);
                const suffix = n !== null ? item.value.slice(String(n).length) : "";

                return (
                  <RevealItem
                    as="div"
                    key={item.label}
                    className="flex items-baseline justify-between gap-6 border-t border-rule py-3"
                  >
                    <dt className="type-eyebrow text-ink-muted">{item.label}</dt>
                    <dd className="type-subhead text-body-lg">
                      {n !== null ? (
                        <>
                          <CountUp value={n} />
                          {suffix}
                        </>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          )}
        </div>

        <div className="relative col-span-12 lg:col-span-4 lg:col-start-9">
          {hasCluster ? (
            <ImageCluster
              className="mx-auto max-w-sm lg:max-w-none"
              items={heroImages.slice(0, 3).map((image) => ({ image }))}
            />
          ) : (
            <div className="relative">
              <ScanLine tone="light" duration={7} className="opacity-30" />
              <HudCorners tone="light" size={22} />
              <AboutHeroPlate />
            </div>
          )}
        </div>

        {lede && (
          <div className="col-span-12 lg:col-span-7">
            <Reveal as="p" className="measure text-body-lg text-ink-muted">
              {lede}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/** Placeholder-tolerant fallback when fewer than two curated stills exist —
 *  same principle as EditorialImage/PersonPortrait/GhostPlate: a deliberate
 *  typographic surface, not an empty box. */
function AboutHeroPlate() {
  return (
    <div className="relative flex aspect-4/5 w-full items-end justify-between border border-rule bg-canvas-alt p-8">
      <span className="type-eyebrow text-ink-muted">About</span>
      <span aria-hidden="true" className="type-display text-h1 leading-none text-ink/8">
        GH
      </span>
    </div>
  );
}
