import Link from "next/link";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import type { About } from "@/lib/schemas";

/**
 * "Who we are" — the home page's first scroll section.
 *
 * Bigger and more editorial than a standard body section on purpose: the
 * brief's own hero note is "no hero image; imagery starts at scroll," so this
 * is deliberately the first place on the page that earns both a step up in
 * type scale and the first photograph. Two things carry that:
 *
 *   · The headline runs at h1 scale, not h2 — one size down from the hero, so
 *     the hierarchy still reads hero > this > every other section head, but
 *     large enough to function as a second, considered statement rather than
 *     a standard section intro. The second line sets in --green, the same
 *     move the /about pull-quote already makes at display scale — reusing an
 *     established pattern rather than adding a new one, and spending --green
 *     (the 20% token), not --accent, so the 10%-accent budget is untouched.
 *   · A single documentary still sits beside the copy, reusing
 *     about.heroImages — the same curated array /about's hero draws its
 *     cluster from — rather than inventing a second content field. Only the
 *     first frame renders here (EditorialImage, not ImageCluster): a quieter
 *     single-image treatment so the fuller three-tile collage stays a thing
 *     /about does, not something repeated on every route. Absent imagery
 *     falls back to EditorialImage's own typographic plate, so the section is
 *     complete before any photography exists in the CMS.
 *
 * The stat and the CTA, previously stacked as two separate reveals, now sit
 * in one row under a single hairline — read together as a caption line under
 * the spread, the way a magazine runs a credit line under a photograph.
 */
export function AboutPrecis({
  about,
  cumulativeYears,
}: {
  about: About;
  cumulativeYears: string;
}) {
  return (
    <Section tone="alt">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel index="01">Who we are</SectionLabel>
          <SectionLabelInline index="01">Who we are</SectionLabelInline>
        </div>

        <div className="col-span-12 lg:col-span-9 lg:col-start-4">
          <HeadlineReveal
            as="h2"
            className="type-display max-w-[18ch] text-h1"
            lines={[
              "Re-definers of",
              <span key="line-2" className="text-green">
                Brand Building.
              </span>,
            ]}
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-5 lg:items-start lg:gap-16">
            <div className="lg:col-span-3">
              <Reveal as="p" className="measure text-body-lg text-ink-muted">
                {about.precis}
              </Reveal>

              <Reveal className="mt-14 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 border-t border-rule pt-6">
                <dl>
                  <dt className="type-eyebrow text-ink-muted">
                    Cumulative leadership experience
                  </dt>
                  <dd className="type-display text-h2 text-gold-ink">
                    {cumulativeYears}
                    <span className="type-subhead ml-3 text-h3 text-ink-muted">
                      years
                    </span>
                  </dd>
                </dl>
                <Link href="/about" className="link-draw type-eyebrow">
                  Read the full story
                </Link>
              </Reveal>
            </div>

            <div className="lg:col-span-2">
              <Reveal>
                <EditorialImage
                  image={about.heroImages[0]}
                  caption="Lagos, Nigeria."
                  ratio="4:5"
                  sizes="(min-width: 1024px) 28vw, 90vw"
                  className="w-full"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
