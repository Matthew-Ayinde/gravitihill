import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { getPractices, getPractice } from "@/content/services";
import { getSector } from "@/content/sectors";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

/**
 * One template over a typed content source — there are no four near-identical
 * page files. Adding a practice is an entry in /admin/services.
 */
export async function generateStaticParams() {
  const practices = await getPractices();
  return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const practice = await getPractice(slug);
  if (!practice) return {};

  return pageMetadata({
    title: practice.name,
    description: practice.proposition,
    path: `/services/${practice.slug}`,
  });
}

export default async function PracticePage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const practice = await getPractice(slug);
  if (!practice) notFound();

  const sectors = (await Promise.all(practice.relatedSectors.map(getSector))).filter(
    (sector) => sector !== undefined,
  );

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(practice),
          breadcrumbJsonLd([
            { name: "Services", path: "/services" },
            { name: practice.name, path: `/services/${practice.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={`Services / ${practice.name}`}
        title={practice.name}
        lede={practice.proposition}
        index={[
          { label: "Services", value: String(practice.offerings.length) },
          { label: "Sectors", value: String(sectors.length) },
        ]}
      />

      <div className="shell">
        <EditorialImage
          image={practice.cover}
          caption={`${practice.name} — Lagos, Nigeria`}
          sizes="(min-width: 1440px) 1320px, 100vw"
          priority
        />
      </div>

      {/* ── Thesis ──────────────────────────────────────────────────────── */}
      <Section>
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">The argument</SectionLabel>
            <SectionLabelInline index="01">The argument</SectionLabelInline>
          </div>
          <div className="col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="measure space-y-6 text-body-lg">
              {practice.thesis.map((paragraph, i) => (
                <Reveal
                  as="p"
                  key={i}
                  className={i === 0 ? "type-subhead text-h3" : undefined}
                >
                  {paragraph}
                </Reveal>
              ))}
            </div>

            {practice.platformHref && (
              <Reveal className="mt-12 border-t border-rule pt-10">
                <p className="type-eyebrow text-green">The platform</p>
                <p className="type-display mt-4 max-w-[18ch] text-h2">
                  Executive coaching runs through The Naked Board.
                </p>
                <ButtonLink href={practice.platformHref} className="mt-8">
                  Go to The Naked Board
                </ButtonLink>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* ── The full service list ───────────────────────────────────────── */}
      <Section tone="alt" labelledBy="offerings-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">What we do</SectionLabel>
            <SectionLabelInline index="02">What we do</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="offerings-heading" className="type-display max-w-[16ch] text-h2">
              {practice.offerings.length} services, listed in full.
            </h2>

            <RevealGroup
              as="ol"
              className="mt-16 grid border-t border-rule md:grid-cols-2 md:gap-x-12"
              stagger={0.05}
            >
              {practice.offerings.map((offering, i) => (
                <RevealItem
                  as="li"
                  key={offering.name}
                  className="flex gap-5 border-b border-rule py-7"
                >
                  <span className="type-eyebrow w-8 shrink-0 pt-1 text-ink-muted">
                    {indexNumber(i)}
                  </span>
                  <Icon
                    name={offering.icon}
                    className="mt-0.5 h-6 w-6 shrink-0 text-green"
                  />
                  <div>
                    <h3 className="type-subhead text-body-lg">{offering.name}</h3>
                    <p className="mt-1.5 text-body text-ink-muted">
                      {offering.note}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Cross-links ─────────────────────────────────────────────────── */}
      {sectors.length > 0 && (
        <Section labelledBy="sectors-heading">
          <div className="shell grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <SectionLabel index="03">Where it runs</SectionLabel>
              <SectionLabelInline index="03">Where it runs</SectionLabelInline>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <h2 id="sectors-heading" className="type-display max-w-[18ch] text-h2">
                Sectors this practice runs into most.
              </h2>

              <ul className="mt-14 border-t border-rule">
                {sectors.map((sector) => (
                  <li key={sector.slug}>
                    <Link
                      href={`/sectors/${sector.slug}`}
                      className="group flex flex-col gap-2 border-b border-rule py-8 transition-colors duration-200 hover:bg-canvas-alt sm:flex-row sm:items-baseline sm:gap-10"
                    >
                      <span className="type-display w-48 shrink-0 text-h3">
                        {sector.name}
                      </span>
                      <span className="measure flex-1 text-ink-muted">
                        {sector.proposition}
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

      <CtaPanel eyebrow="Engage" heading={`Start with ${practice.name.toLowerCase()}.`} />
    </>
  );
}
