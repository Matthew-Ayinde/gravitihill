import type { Metadata } from "next";
import Link from "next/link";
import { PracticeList } from "@/components/sections/PracticeList";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { SocialWall } from "@/components/sections/SocialWall";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { PreviewRows } from "@/components/sections/PreviewRows";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { ABOUT } from "@/content/about";
import { DNA_PILLARS } from "@/content/dna";
import { INSIGHTS } from "@/content/insights";
import { NAKED_BOARD } from "@/content/naked-board";
import { CUMULATIVE_YEARS } from "@/content/team";
import { webSiteJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { editorialDate, indexNumber } from "@/lib/utils";

export const metadata: Metadata = {
  // Absolute — home does not take the `%s | Graviti Hill` template.
  title: {
    absolute: "Graviti Hill | Business Advisory & Brand Building, Lagos",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const latest = INSIGHTS.slice(0, 3);

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />

      {/* ══ 1. Hero ═══════════════════════════════════════════════════════
          Type-first, no image, no eyebrow label. The h1 renders statically —
          it is the LCP element and nothing is allowed to delay its paint. */}
      <section className="pt-36 pb-16 lg:pt-48">
        <div className="shell grid-12 gap-y-12">
          <h1 className="type-display col-span-12 text-hero lg:col-span-9">
            We build and sustain{" "}
            <span className="accent-word">future-forward</span> businesses.
          </h1>

          {/* Evidence in the margin rather than a label above the headline. */}
          <dl className="col-span-12 self-end lg:col-span-2 lg:col-start-11">
            {ABOUT.facts.map((fact) => (
              <div key={fact.label} className="border-t border-rule py-2.5">
                <dt className="type-eyebrow text-ink-muted">{fact.label}</dt>
                <dd className="type-subhead text-body-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="shell mt-16 lg:mt-24">
          <div className="grid-12 gap-y-8 border-t border-rule pt-9">
            <p className="measure col-span-12 text-body-lg lg:col-span-6">
              Founded in Lagos in 2022 to close the distance between a good idea
              and a measurable outcome. Brand and advisory, run by one team.
            </p>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
              <ButtonLink href="/contact">Start a conversation</ButtonLink>
            </div>
          </div>
        </div>
        
      </section>

      {/* ══ 2. About précis ═══════════════════════════════════════════════ */}
      <Section tone="alt">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">Who we are</SectionLabel>
            <SectionLabelInline index="01">Who we are</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <HeadlineReveal
              as="h2"
              className="type-display text-h2"
              lines={["Re-definers of", "Brand Building."]}
            />
            <Reveal as="p" className="measure mt-10 text-body-lg">
              {ABOUT.precis}
            </Reveal>

            {/* The 55+ years figure set as editorial data — a line in a
                record, not a stat card with a big number and an icon. */}
            <Reveal className="mt-12 border-t border-rule pt-6">
              <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <dt className="type-eyebrow text-ink-muted">
                  Cumulative leadership experience
                </dt>
                <dd className="type-display text-h2">
                  {CUMULATIVE_YEARS}
                  <span className="type-subhead ml-3 text-h3 text-ink-muted">
                    years
                  </span>
                </dd>
              </dl>
            </Reveal>

            <Reveal className="mt-10">
              <Link href="/about" className="link-draw type-eyebrow">
                Read the full story
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ══ 3. Practices ══════════════════════════════════════════════════ */}
      <Section labelledBy="practices-heading">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">Practice</SectionLabel>
            <SectionLabelInline index="02">Practice</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="practices-heading" className="type-display max-w-[16ch] text-h2">
              Four practices, staffed from one bench.
            </h2>
            <div className="mt-14">
              <PracticeList />
            </div>
          </div>
        </div>
      </Section>

      {/* ══ 4. THE SIGNATURE ══════════════════════════════════════════════ */}
      <SectorsSection index="03" />

      {/* ══ 5. Brand DNA ══════════════════════════════════════════════════ */}
      <Section labelledBy="dna-heading">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="04">DNA</SectionLabel>
            <SectionLabelInline index="04">DNA</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="dna-heading" className="type-display max-w-[16ch] text-h2">
              Four commitments the work is measured against.
            </h2>

            <RevealGroup
              as="ul"
              className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2"
            >
              {DNA_PILLARS.map((pillar, i) => (
                <RevealItem
                  as="li"
                  key={pillar.name}
                  className="relative bg-canvas p-8 lg:p-10"
                >
                  <span className="type-eyebrow absolute top-8 right-8 text-ink-muted lg:top-10 lg:right-10">
                    {indexNumber(i)}
                  </span>

                  {/* Icon sits on the name's baseline, not stacked above a
                      centred column. This is a matrix, not a feature grid. */}
                  <h3 className="type-subhead flex items-baseline gap-3 pr-10 text-h3">
                    <Icon
                      name={pillar.icon}
                      className="h-5 w-5 shrink-0 translate-y-0.5 text-green"
                    />
                    {pillar.name}
                  </h3>
                  <p className="measure-tight mt-4 text-body-lg text-ink-muted">
                    {pillar.summary}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ══ 6. The Naked Board teaser ═════════════════════════════════════ */}
      <Section tone="ridge" labelledBy="tnb-heading">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="05" tone="dark">
              Platform
            </SectionLabel>
            <SectionLabelInline index="05" tone="dark">
              Platform
            </SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <p className="type-eyebrow text-accent">A Graviti Hill platform</p>
            <h2
              id="tnb-heading"
              className="type-display mt-6 max-w-[14ch] text-h1 text-white"
            >
              The Naked Board.
            </h2>
            <p className="measure mt-8 text-body-lg text-white/75">
              {NAKED_BOARD.premise} Our proprietary executive coaching platform
              exists for exactly those conversations — succession, founder
              dependence, a culture that punishes bad news.
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
              {NAKED_BOARD.stages.slice(0, 3).map((stage) => (
                <li
                  key={stage.name}
                  className="type-eyebrow flex items-center gap-2 text-white/55"
                >
                  <Icon name={stage.icon} className="h-4 w-4 text-white" />
                  {stage.name}
                </li>
              ))}
            </ul>

            <ButtonLink href="/the-naked-board" tone="dark" className="mt-10">
              Go to The Naked Board
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ══ 7. Insights ═══════════════════════════════════════════════════
          Editorial rows, not a three-card grid — and the same component the
          /insights index uses, so one interaction serves both surfaces. */}
      <Section tone="alt" labelledBy="insights-heading">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="06">Insights</SectionLabel>
            <SectionLabelInline index="06">Insights</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="insights-heading" className="type-display max-w-[16ch] text-h2">
              Positions, not commentary.
            </h2>

            <div className="mt-14 border-b border-rule">
              <PreviewRows
                items={latest.map((insight) => ({
                  id: insight.slug,
                  href: `/insights/${insight.slug}`,
                  leading: (
                    <time dateTime={insight.publishedAt}>
                      {editorialDate(insight.publishedAt)}
                    </time>
                  ),
                  title: insight.title,
                  note: insight.excerpt,
                  trailing: `${insight.category} · ${insight.readingTime} min`,
                  preview: (
                    <EditorialImage
                      image={insight.coverImage}
                      caption={insight.category}
                      sizes="352px"
                    />
                  ),
                }))}
              />
            </div>

            <Link href="/insights" className="link-draw type-eyebrow mt-10 inline-block">
              All insights
            </Link>
          </div>
        </div>
      </Section>

      {/* ══ 8. Social wall ════════════════════════════════════════════════ */}
      <SocialWall index="07" />

      {/* ══ 9. Contact ════════════════════════════════════════════════════ */}
      <CtaPanel eyebrow="Start" heading="Start a conversation." />
    </>
  );
}
