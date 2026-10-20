import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { HudCorners } from "@/components/motion/HudCorners";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Tilt3D } from "@/components/motion/Tilt3D";
import { Icon } from "@/components/icons";
import { getSectors, getSector } from "@/content/sectors";
import { getPractices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/sectors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) return {};

  return pageMetadata({
    title: `${sector.name} Sector`,
    description: `${sector.proposition} ${sector.thesis[0]}`,
    path: `/sectors/${sector.slug}`,
  });
}

export default async function SectorPage({
  params,
}: PageProps<"/sectors/[slug]">) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();

  const allPractices = await getPractices();
  const practices = allPractices.filter((practice) =>
    practice.relatedSectors.includes(sector.slug),
  );

  return (
    <>
      <PageHero
        eyebrow={`Perspectives / ${sector.name}`}
        title={sector.proposition}
        lede={sector.image ? undefined : sector.thesis[0]}
      />

      <div className="shell relative">
        <HudCorners tone="light" size={28} className="z-10" />
        <div className="relative">
          <EditorialImage
            image={sector.image}
            sizes="(min-width: 1440px) 1320px, 100vw"
            priority
          />
          {/* With a photograph present, the opening statement is carried by
              the image: a --ridge band across its base from md up, stacked
              beneath it on small screens where a 3:2 frame is too shallow. */}
          {sector.image && (
            <div className="bg-ridge px-6 py-8 text-white md:absolute md:inset-x-0 md:bottom-0 md:bg-ridge/85 md:px-10 md:py-10">
              <p className="measure text-body-lg">{sector.thesis[0]}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Thesis ──────────────────────────────────────────────────────── */}
      {(sector.position?.length || sector.thesis.length > 1) && (
        <Section>
          <div className="shell grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel index="01">Our point of view</SectionLabel>
              <SectionLabelInline index="01">Our point of view</SectionLabelInline>
            </div>
            <div className="col-span-12 lg:col-span-8 lg:col-start-5">
              {sector.position?.length ? (
                <div className="measure space-y-10">
                  {sector.position.map((point) => (
                    <Reveal key={point.name}>
                      <h2 className="type-subhead text-h3">{point.name}</h2>
                      <p className="mt-3 text-body-lg text-ink-muted">{point.note}</p>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="measure space-y-6">
                  {sector.thesis.slice(1).map((paragraph, i) => (
                    <Reveal as="p" key={i} className="type-subhead text-h3">
                      {paragraph}
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {/* ── Strategic approach ──────────────────────────────────────────── */}
      <Section tone="alt" labelledBy="approach-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">Approach</SectionLabel>
            <SectionLabelInline index="02">Approach</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="approach-heading" className="type-display max-w-[16ch] text-h2">
              {sector.approachHeading ?? "How we deliver it."}
            </h2>

            <RevealGroup as="ol" className="mt-14 border-t border-rule">
              {sector.approach.map((step, i) => (
                <RevealItem
                  as="li"
                  key={step.name}
                  className="group grid-12 gap-y-3 border-b border-rule py-8 transition-colors duration-200 ease-brand hover:bg-canvas"
                >
                  <div className="col-span-12 flex items-baseline gap-5 lg:col-span-5">
                    <span className="type-eyebrow text-ink-muted transition-colors duration-200 ease-brand group-hover:text-green">
                      {indexNumber(i)}
                    </span>
                    <Icon
                      name={step.icon}
                      className="h-6 w-6 translate-y-1 text-green transition-transform duration-300 ease-brand group-hover:scale-110"
                    />
                    <h3 className="type-subhead text-h3">{step.name}</h3>
                  </div>
                  <p className="measure col-span-12 text-body-lg text-ink-muted lg:col-span-7">
                    {step.note}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Differentiators ─────────────────────────────────────────────── */}
      <Section labelledBy="difference-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="03">Difference</SectionLabel>
            <SectionLabelInline index="03">Difference</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2
              id="difference-heading"
              className="type-display max-w-[18ch] text-h2"
            >
              {sector.differenceHeading ?? "What makes us different here."}
            </h2>

            {sector.differencePoints?.length ? (
              <RevealGroup as="ul" className="mt-14 border-t border-rule">
                {sector.differencePoints.map((point) => (
                  <RevealItem
                    as="li"
                    key={point}
                    className="border-b border-rule py-6"
                  >
                    <p className="measure text-body-lg">{point}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : (
              <RevealGroup
                as="ul"
                className="perspective-scene mt-14 grid gap-px border border-rule bg-rule md:grid-cols-3"
              >
                {sector.differentiators.map((item) => (
                  <RevealItem as="li" key={item.name} className="h-full">
                    {/* Same tilt-only 3D statement used on the home DNA grid:
                        no glare, no gradient sheen, just the card leaning off
                        the plane toward the cursor and settling back. */}
                    <Tilt3D className="h-full bg-canvas p-8 md:p-10">
                      <h3 className="type-subhead text-h3">{item.name}</h3>
                      <p className="mt-4 text-ink-muted">{item.note}</p>
                    </Tilt3D>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </div>
        </div>
      </Section>

      {/* ── Practices that run here ─────────────────────────────────────── */}
      {practices.length > 0 && !sector.hidePractices && (
        <Section tone="alt" labelledBy="practices-heading">
          <div className="shell grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel index="04">Practices</SectionLabel>
              <SectionLabelInline index="04">Practices</SectionLabelInline>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <h2
                id="practices-heading"
                className="type-display max-w-[18ch] text-h2"
              >
                {sector.practicesHeading ??
                  `What we bring to ${sector.name.toLowerCase()} work.`}
              </h2>

              <ul className="mt-14 border-t border-rule">
                {practices.map((practice) => (
                  <li key={practice.slug}>
                    <Link
                      href={`/services/${practice.slug}`}
                      className="group relative flex flex-col gap-2 border-b border-rule py-8 transition-colors duration-200 hover:bg-canvas sm:flex-row sm:items-baseline sm:gap-10"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-2 bottom-2 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
                      />
                      <span className="type-display w-64 shrink-0 text-h3">
                        {practice.name}
                      </span>
                      <span className="measure flex-1 text-ink-muted">
                        {sector.practiceNotes?.find(
                          (n) => n.name === practice.slug,
                        )?.note ?? practice.proposition}
                      </span>
                      <span
                        aria-hidden="true"
                        className="type-subhead hidden text-ink-muted transition-transform duration-200 ease-brand group-hover:translate-x-1 sm:block"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      <CtaPanel
        eyebrow="Engage"
        heading={sector.ctaHeading ?? `Talk to us about ${sector.name}.`}
        lede={sector.ctaBody}
        routesLabel={sector.ctaLabel}
        intense
      />
    </>
  );
}
