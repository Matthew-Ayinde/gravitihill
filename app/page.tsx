import type { Metadata } from "next";
import Link from "next/link";
import { PracticeList } from "@/components/sections/PracticeList";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { SocialWall } from "@/components/sections/SocialWall";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { PreviewRows } from "@/components/sections/PreviewRows";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { TypedHeadline } from "@/components/motion/TypedHeadline";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Magnetic } from "@/components/motion/Magnetic";
import { Marquee } from "@/components/motion/Marquee";
import { Parallax } from "@/components/motion/Parallax";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { Icon } from "@/components/icons";
import { getAbout } from "@/content/about";
import { getDnaPillars } from "@/content/dna";
import { getInsights } from "@/content/insights";
import { getNakedBoard } from "@/content/naked-board";
import { getPractices } from "@/content/services";
import { getSectors } from "@/content/sectors";
import { CUMULATIVE_YEARS } from "@/content/team";
import { getHomeHeroMedia } from "@/lib/home-hero";
import { webSiteJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";
import { cn, editorialDate, indexNumber } from "@/lib/utils";

export const metadata: Metadata = {
  // Absolute: home does not take the `%s | Graviti Hill` template.
  title: {
    absolute: "Graviti Hill | Business Advisory & Brand Building, Lagos",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [about, dnaPillars, insights, nakedBoard, hero, practices, sectors] =
    await Promise.all([
      getAbout(),
      getDnaPillars(),
      getInsights(),
      getNakedBoard(),
      getHomeHeroMedia(),
      getPractices(),
      getSectors(),
    ]);
  const latest = insights.slice(0, 3);
  const hasHeroMedia = hero.items.length > 0;
  const marqueeWords = [
    ...practices.map((p) => p.name),
    ...sectors.map((s) => s.name),
    "Lagos",
    "West Africa",
  ];

  return (
    <>
      <JsonLd data={webSiteJsonLd()} />

      {/* ══ 1. Hero ═══════════════════════════════════════════════════════
          Type-first. No eyebrow label, and, by default, no image: the
          brief protects the hero's LCP by making the headline itself the
          LCP element. An admin can opt into a background at /admin/home;
          when they do, that trade is made deliberately (see the comment
          on the background layer below), and the section switches to its
          dark-panel palette so type stays legible over photography.

          The headline types on. Untyped characters stay in the DOM at
          opacity 0, so the line box is the full string from the first frame:
          no reflow, no CLS. The full text is in the server HTML for crawlers
          and screen readers; reduced motion and no-JS resolve to plain text
          through CSS alone. See TypedHeadline for the LCP trade-off. */}
      <section
        className={cn(
          "perspective-scene relative overflow-hidden pt-36 pb-16 lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:pt-48 lg:pb-20 2xl:pt-56 2xl:pb-24",
          hasHeroMedia && "text-white",
        )}
      >
        {/* aria-hidden inside HeroBackground: purely decorative, the
            headline carries the meaning. No `priority`-vs-font tug-of-war to
            solve here since the headline is server-rendered text with no
            webfont blocking it; the trade this layer makes is that a
            full-bleed background becomes a second, larger LCP candidate than
            that text on first paint, which is why it stays admin-optional
            rather than default. See HeroBackground for the rotation itself. */}
        {hasHeroMedia && <HeroBackground items={hero.items} />}

        {/* The hero as a real depth scene, not a flat banner: this block
            sits on its own Z-plane and leans very slightly toward the
            cursor. `max=3` keeps it a texture, not a toy — the headline
            stays the LCP element and renders with it, not after it. */}
        <Tilt3D as="div" max={3} scale={1} className="shell grid-12 gap-y-12">
          <TypedHeadline
            className="type-display col-span-12 text-hero lg:col-span-9"
            segments={[
              { text: "We build and sustain " },
              {
                text: "future-forward",
                className: hasHeroMedia ? "accent-word-dark" : "accent-word",
              },
              { text: " businesses." },
            ]}
          />

          {/* Evidence in the margin rather than a label above the headline. */}
          <dl className="col-span-12 self-end lg:col-span-2 lg:col-start-11">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className={cn(
                  "border-t py-2.5",
                  hasHeroMedia ? "border-rule-dark" : "border-rule",
                )}
              >
                <dt
                  className={cn(
                    "type-eyebrow",
                    hasHeroMedia ? "text-white/60" : "text-ink-muted",
                  )}
                >
                  {fact.label}
                </dt>
                <dd className="type-subhead text-body-lg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Tilt3D>

        <div className="shell mt-16 lg:mt-0">
          <div
            className={cn(
              "grid-12 gap-y-8 border-t pt-9",
              hasHeroMedia ? "border-rule-dark" : "border-rule",
            )}
          >
            <p
              className={cn(
                "measure col-span-12 text-body-lg lg:col-span-6",
                hasHeroMedia && "text-white/85",
              )}
            >
              Founded in Lagos in 2022 to close the distance between a good idea
              and a measurable outcome. Brand and advisory, run by one team.
            </p>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
              <Magnetic strength={0.35}>
                <ButtonLink href="/contact" tone={hasHeroMedia ? "dark" : "light"}>
                  Start a conversation
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>

      </section>

      {/* ══ Ambient ribbon — the practices and sectors, restated as texture.
          Decorative and aria-hidden: both lists are fully navigable in the
          nav and the sections below. ═══════════════════════════════════════ */}
      <div className="border-y border-rule bg-canvas-alt py-5">
        <Marquee
          items={marqueeWords}
          itemClassName="type-eyebrow text-ink-muted"
          speed={38}
          tilt
        />
      </div>

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
              {about.precis}
            </Reveal>

            {/* The 55+ years figure set as editorial data: a line in a
                record, not a stat card with a big number and an icon.
                This is the one figure on the page that gets gold — the
                rarest colour on the site, spent here and nowhere else on
                this route. --gold-ink, not --gold: this sits on --canvas-alt,
                and --gold itself only clears WCAG contrast on a dark
                surface (see the note in globals.css). */}
            <Reveal className="mt-12 border-t border-rule pt-6">
              <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <dt className="type-eyebrow text-ink-muted">
                  Cumulative leadership experience
                </dt>
                <dd className="type-display text-h2 text-gold-ink">
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
              className="perspective-scene mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2"
            >
              {dnaPillars.map((pillar, i) => (
                <RevealItem as="li" key={pillar.name} className="h-full">
                  {/* The tilt is the whole 3D statement here: no glare, no
                      gradient sheen — just the card leaning off the plane
                      toward the cursor, and settling back when it leaves. */}
                  <Tilt3D className="relative h-full bg-canvas p-8 lg:p-10">
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
                  </Tilt3D>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ══ 6. The Naked Board teaser ═════════════════════════════════════ */}
      <Section tone="ridge" labelledBy="tnb-heading" className="relative overflow-hidden">
        {/* A ghost numeral, not a wave: pure type, drifting a beat slower than
            the section scrolls past. Depth without touching the mark. */}
        <Parallax
          direction="down"
          range={0.2}
          className="pointer-events-none absolute -top-10 right-0 z-0 select-none"
        >
          <span
            aria-hidden="true"
            className="type-display block text-[28rem] leading-none text-white/4"
          >
            05
          </span>
        </Parallax>

        <div className="shell grid-12 relative z-10 gap-y-10">
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
              {nakedBoard.premise} Our proprietary executive coaching platform
              exists for exactly those conversations: succession, founder
              dependence, a culture that punishes bad news.
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
              {nakedBoard.stages.slice(0, 3).map((stage) => (
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
          Editorial rows, not a three-card grid, and the same component the
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
