import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { Marquee } from "@/components/motion/Marquee";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Spotlight } from "@/components/motion/Spotlight";
import { getSectors } from "@/content/sectors";
import { getPractices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Sectors",
  description:
    "Consumer, B2B and Technology — three sectors, each with its own proposition, strategic approach and point of difference.",
  path: "/sectors",
});

export default async function SectorsPage() {
  const [sectors, practices] = await Promise.all([getSectors(), getPractices()]);
  return (
    <>
      <PageHero
        eyebrow="Sectors"
        title={
          <>
            Three sectors. Three{" "}
            <span className="accent-word">arguments.</span>
          </>
        }
        lede="We do not run one playbook across every category. What wins in consumer does not transfer to a B2B pipeline, and neither transfers to a technology business explaining a new category to its own market."
      />

      {/* ── Ambient ribbon — decorative and aria-hidden; every name here is
          fully navigable in the signature panel and the practices list. ── */}
      <div className="border-y border-rule bg-canvas-alt py-5">
        <Marquee
          items={[...sectors.map((s) => s.name), ...practices.map((p) => p.name)]}
          itemClassName="type-eyebrow text-ink-muted"
          speed={40}
          tilt
        />
      </div>

      <SectorsSection index="01" />

      <Section labelledBy="difference-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">At a glance</SectionLabel>
            <SectionLabelInline index="02">At a glance</SectionLabelInline>
          </div>

          <div className="relative col-span-12 lg:col-span-9">
            <Spotlight tone="light" size={620} />
            <h2 id="difference-heading" className="type-display max-w-[18ch] text-h2">
              What changes between them.
            </h2>

            <RevealGroup as="ul" className="mt-14 border-t border-rule">
              {sectors.map((sector, i) => (
                <RevealItem as="li" key={sector.slug}>
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="group relative grid-12 gap-y-5 border-b border-rule py-10 transition-colors duration-200 ease-brand hover:bg-canvas-alt"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-2 bottom-2 left-0 w-0.5 origin-center scale-y-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-y-100"
                    />
                    <div className="col-span-12 flex items-baseline gap-5 lg:col-span-4">
                      <span className="type-eyebrow text-ink-muted">
                        {indexNumber(i)}
                      </span>
                      <h3 className="type-display text-h2">{sector.name}</h3>
                    </div>

                    <div className="col-span-12 lg:col-span-7">
                      <p className="type-subhead text-h3">{sector.proposition}</p>
                      <ul className="mt-5 space-y-1.5">
                        {sector.differentiators.map((item) => (
                          <li
                            key={item.name}
                            className="type-eyebrow text-ink-muted"
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span
                      aria-hidden="true"
                      className="type-subhead col-span-1 hidden self-end text-right text-ink-muted transition-transform duration-200 ease-brand group-hover:translate-x-1 lg:block"
                    >
                      →
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      <CtaPanel eyebrow="Engage" heading="Tell us which market you are trying to win." intense />
    </>
  );
}
