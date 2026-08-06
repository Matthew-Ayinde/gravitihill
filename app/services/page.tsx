import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { Icon } from "@/components/icons";
import { getPractices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { indexNumber } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Four practices — Brand Development, Business Advisory, Executive Coaching and Market Expansion — staffed from one bench in Lagos.",
  path: "/services",
});

export default async function ServicesPage() {
  const practices = await getPractices();
  const totalOfferings = practices.reduce(
    (sum, practice) => sum + practice.offerings.length,
    0,
  );

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Four practices,{" "}
            <span className="accent-word">one bench.</span>
          </>
        }
        lede="Brand work here interrogates the process that fulfils the promise. Advisory work interrogates what the market has been told to expect. Both are staffed by the same people, which is the point."
        index={[
          { label: "Practices", value: String(practices.length) },
          { label: "Services", value: String(totalOfferings) },
          { label: "Sectors", value: "3" },
        ]}
      />

      <Section>
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">Practices</SectionLabel>
            <SectionLabelInline index="01">Practices</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <RevealGroup as="ul" className="border-t border-rule">
              {practices.map((practice, i) => (
                <RevealItem as="li" key={practice.slug}>
                  <Link
                    href={`/services/${practice.slug}`}
                    className="group grid-12 gap-y-6 border-b border-rule py-12 transition-colors duration-200 ease-brand hover:bg-canvas-alt"
                  >
                    <div className="col-span-12 flex items-baseline gap-5 lg:col-span-5">
                      <span className="type-eyebrow text-ink-muted">
                        {indexNumber(i)}
                      </span>
                      <h2 className="type-display text-h2">{practice.name}</h2>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                      <p className="measure text-body-lg">
                        {practice.proposition}
                      </p>
                      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                        {practice.offerings.slice(0, 3).map((offering) => (
                          <li
                            key={offering.name}
                            className="type-eyebrow flex items-center gap-2 text-ink-muted"
                          >
                            <Icon
                              name={offering.icon}
                              className="h-4 w-4 text-green"
                            />
                            {offering.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="type-eyebrow col-span-12 self-end text-ink-muted lg:col-span-1 lg:text-right">
                      {practice.offerings.length} services
                      <span
                        aria-hidden="true"
                        className="ml-3 inline-block transition-transform duration-200 ease-brand group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </p>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      <CtaPanel
        eyebrow="Engage"
        heading="Tell us which of the four you think you need."
      />
    </>
  );
}
