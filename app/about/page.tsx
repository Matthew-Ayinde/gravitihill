import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { PreviewRows } from "@/components/sections/PreviewRows";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { PersonPortrait } from "@/components/ui/PersonCard";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/jsonld";
import { ABOUT } from "@/content/about";
import { DNA_PILLARS } from "@/content/dna";
import { TEAM } from "@/content/team";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Graviti Hill is a business advisory and branding firm founded in Lagos in 2022, built to close the gap between creative thinking and measurable business impact.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          ...TEAM.map(personJsonLd),
          breadcrumbJsonLd([{ name: "About", path: "/about" }]),
        ]}
      />

      <PageHero
        eyebrow="About"
        title={
          <>
            Re-definers of Brand{" "}
            <span className="accent-word">Building.</span>
          </>
        }
        lede={ABOUT.precis}
        index={ABOUT.facts}
      />

      {/* ── Origin ──────────────────────────────────────────────────────── */}
      <Section tone="alt">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">Origin</SectionLabel>
            <SectionLabelInline index="01">Origin</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <HeadlineReveal
              as="h2"
              className="type-display text-h2"
              lines={["Founded 2022,", "on a specific frustration."]}
            />

            <div className="mt-12 space-y-14">
              {ABOUT.origin.map((block, blockIndex) => (
                <div key={block.heading}>
                  <h3 className="type-eyebrow text-green">
                    {indexNumber(blockIndex)}
                    <span aria-hidden="true" className="mx-2">
                      —
                    </span>
                    {block.heading}
                  </h3>
                  <div className="measure mt-5 space-y-5 text-body-lg">
                    {block.body.map((paragraph, i) => (
                      <Reveal as="p" key={i}>
                        {paragraph}
                      </Reveal>
                    ))}
                  </div>

                  {/* The pull-quote sits between the two blocks, in the
                      left margin, breaking the measure deliberately. */}
                  {blockIndex === 0 && (
                    <Reveal
                      as="blockquote"
                      className="mt-14 border-t border-rule pt-8"
                    >
                      <p className="type-display max-w-[22ch] text-h2 text-green">
                        {ABOUT.pullQuote}
                      </p>
                    </Reveal>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── DNA ─────────────────────────────────────────────────────────── */}
      <Section labelledBy="dna-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">Brand DNA</SectionLabel>
            <SectionLabelInline index="02">Brand DNA</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="dna-heading" className="type-display max-w-[18ch] text-h2">
              Four commitments the work is measured against.
            </h2>

            <RevealGroup as="ul" className="mt-16 border-t border-rule">
              {DNA_PILLARS.map((pillar, i) => (
                <RevealItem
                  as="li"
                  key={pillar.name}
                  className="grid-12 gap-y-4 border-b border-rule py-10"
                >
                  <div className="col-span-12 flex items-baseline gap-4 lg:col-span-5">
                    <Icon
                      name={pillar.icon}
                      className="h-6 w-6 translate-y-1 text-green"
                    />
                    <div>
                      <h3 className="type-subhead text-h3">{pillar.name}</h3>
                      <p className="type-eyebrow mt-2 text-ink-muted">
                        {pillar.summary}
                      </p>
                    </div>
                    <span className="type-eyebrow ml-auto text-ink-muted lg:hidden">
                      {indexNumber(i)}
                    </span>
                  </div>

                  <p className="measure col-span-12 text-body-lg text-ink-muted lg:col-span-6">
                    {pillar.detail}
                  </p>

                  <span className="type-eyebrow col-span-1 hidden text-right text-ink-muted lg:block">
                    {indexNumber(i)}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Leadership ──────────────────────────────────────────────────── */}
      <Section tone="alt" labelledBy="leadership-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="03">Leadership</SectionLabel>
            <SectionLabelInline index="03">Leadership</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2
              id="leadership-heading"
              className="type-display max-w-[20ch] text-h2"
            >
              Fifty-five years of it, and none of it theoretical.
            </h2>

            <div className="mt-16 border-b border-rule">
              <PreviewRows
                items={TEAM.map((person) => ({
                  id: person.slug,
                  leading: person.role,
                  title: person.name,
                  note: person.bio[0],
                  trailing: person.credentials[0],
                  preview: (
                    <PersonPortrait person={person} className="w-full" />
                  ),
                }))}
              />
            </div>

            <ul className="mt-14 grid gap-10 sm:grid-cols-3">
              {TEAM.map((person) => (
                <li key={person.slug}>
                  <h3 className="type-eyebrow text-green">{person.name}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {person.credentials.map((credential) => (
                      <li key={credential} className="text-caption text-ink-muted">
                        {credential}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaPanel
        eyebrow="Next"
        heading="Bring us the problem you have been deferring."
      />
    </>
  );
}
