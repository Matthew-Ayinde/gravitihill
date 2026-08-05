import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { SECTORS } from "@/content/sectors";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Sectors",
  description:
    "Consumer, B2B and Technology — three sectors, each with its own proposition, strategic approach and point of difference.",
  path: "/sectors",
});

export default function SectorsPage() {
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

      <SectorsSection index="01" />

      <Section labelledBy="difference-heading">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="02">At a glance</SectionLabel>
            <SectionLabelInline index="02">At a glance</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <h2 id="difference-heading" className="type-display max-w-[18ch] text-h2">
              What changes between them.
            </h2>

            <RevealGroup as="ul" className="mt-14 border-t border-rule">
              {SECTORS.map((sector, i) => (
                <RevealItem as="li" key={sector.slug}>
                  <Link
                    href={`/sectors/${sector.slug}`}
                    className="group grid-12 gap-y-5 border-b border-rule py-10 transition-colors duration-200 ease-brand hover:bg-canvas-alt"
                  >
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

      <CtaPanel eyebrow="Engage" heading="Tell us which market you are trying to win." />
    </>
  );
}
