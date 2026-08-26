import Link from "next/link";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { ImageCluster } from "@/components/motion/ImageCluster";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import type { About, Img } from "@/lib/schemas";
import { SITE } from "@/lib/site";

/**
 * The homepage hero.
 *
 * Two layouts, one decision: whether an admin has set a custom background at
 * /admin/home (see app/page.tsx / lib/home-hero.ts). That flag already
 * exists and SiteHeader already reads it to decide its own unscrolled
 * colour, so this preserves it rather than adding a second, competing hero
 * concept:
 *
 *   · No admin background (the default, common state): the type-first hero
 *     below — an instant, unanimated H1 (the LCP element) beside a layered
 *     collage of the practice/sector documentary photography that already
 *     exists in the CMS. Only the collage's two smaller, secondary tiles
 *     animate in; the large base tile — the likely LCP candidate — renders
 *     at full opacity immediately. See ImageCluster's own comment.
 *   · An admin background is set: the full-bleed rotating photo/video hero
 *     this route already had, untouched — that trade (a bigger LCP
 *     candidate than plain text) is one the brief already documented as
 *     admin-opt-in only, and stays that way.
 *
 * Either way the H1 itself is never animated — see HeadlineReveal's own
 * comment on why above-the-fold titles don't get the masked entrance this
 * page uses everywhere else.
 */
export function HeroSection({
  about,
  cumulativeYears,
  heroItems,
  clusterImages,
}: {
  about: About;
  cumulativeYears: string;
  heroItems: Img[];
  clusterImages: Img[];
}) {
  const hasHeroMedia = heroItems.length > 0;

  if (hasHeroMedia) {
    return (
      <section className="relative overflow-hidden pt-36 pb-16 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:pt-48 lg:pb-20 2xl:pt-56 2xl:pb-24">
        <HeroBackground items={heroItems} />
        <div className="shell relative z-10">
          <p className="type-eyebrow text-white/60">
            Est. {SITE.foundingDate} — Lagos, Nigeria
          </p>
          <h1 className="type-display col-span-12 mt-6 max-w-[15ch] text-hero lg:col-span-9">
            We build and sustain{" "}
            <span className="accent-word-dark">future-forward</span>{" "}
            businesses.
          </h1>
        </div>

        <div className="shell relative z-10 mt-16 lg:mt-0">
          <div className="grid-12 gap-y-8 border-t border-rule-dark pt-9">
            <p className="measure col-span-12 text-body-lg text-white/85 lg:col-span-6">
              Founded in Lagos in 2022 to close the distance between a good
              idea and a measurable outcome. Brand and advisory, run by one
              team.
            </p>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
              <Magnetic strength={0.35}>
                <ButtonLink href="/contact" tone="dark">
                  Start a conversation
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28 2xl:pt-52">
      {/* Atmospheric light, not a panel: a large, soft, low-opacity radial
          field built from the brand's own greens/golds — see the .glow-*
          utilities in globals.css. Sits behind everything, aria-hidden. */}
      <div
        aria-hidden="true"
        className="glow-green pointer-events-none absolute -top-1/3 right-[-10%] h-[70vw] w-[70vw] max-w-248 max-h-248 opacity-70"
      />

      <div className="shell relative grid-12 items-start gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <p className="type-eyebrow text-ink-muted">
            Est. {SITE.foundingDate} — Lagos, Nigeria
          </p>

          <h1 className="type-display mt-6 max-w-[13ch] text-hero">
            We build and sustain{" "}
            <span className="accent-word">future-forward</span> businesses.
          </h1>
        </div>

        <div className="relative col-span-12 lg:col-span-5 lg:col-start-8">
          {clusterImages.length >= 2 ? (
            <ImageCluster
              className="mx-auto max-w-md lg:max-w-none"
              items={clusterImages.map((image) => ({ image }))}
            />
          ) : (
            <GhostPlate />
          )}

          {/* Floating editorial data — real content (about.facts), not
              invented metrics, set as hairline tags rather than pill
              badges. */}
          <dl className="relative z-40 mt-8 flex flex-wrap gap-3">
            {about.facts.slice(0, 2).map((fact) => (
              <div
                key={fact.label}
                className="border border-rule bg-canvas px-4 py-2.5"
              >
                <dt className="type-eyebrow text-ink-muted">{fact.label}</dt>
                <dd className="type-subhead text-body-lg">{fact.value}</dd>
              </div>
            ))}
            <div className="border border-rule bg-canvas px-4 py-2.5">
              <dt className="type-eyebrow text-ink-muted">
                Cumulative leadership experience
              </dt>
              <dd className="type-subhead text-body-lg">
                {cumulativeYears} years
              </dd>
            </div>
          </dl>
        </div>

        <div className="col-span-12 border-t border-rule pt-9 lg:col-span-9">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <p className="measure text-body-lg">
              Founded in Lagos in 2022 to close the distance between a good
              idea and a measurable outcome. Brand and advisory, run by one
              team.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic strength={0.35}>
                <ButtonLink href="/contact">Start a conversation</ButtonLink>
              </Magnetic>
              <Magnetic strength={0.25}>
                <ButtonLink href="#sectors" variant="secondary">
                  See how we work
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

/** Placeholder-tolerant fallback when the CMS has fewer than two practice/
 *  sector covers to draw the collage from — a typographic plate rather than
 *  an empty box, same principle EditorialImage and PersonCard already use. */
function GhostPlate() {
  return (
    <div className="relative flex aspect-4/5 w-full items-end justify-between border border-rule bg-canvas-alt p-8">
      <span className="type-eyebrow text-ink-muted">Graviti Hill</span>
      <span aria-hidden="true" className="type-display text-ghost text-rule">
        GH
      </span>
    </div>
  );
}

function ScrollCue() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-10 left-0 hidden w-full justify-center lg:flex"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="type-eyebrow text-ink-muted">Scroll</span>
        <span className="h-10 w-px bg-rule" />
      </div>
    </div>
  );
}
