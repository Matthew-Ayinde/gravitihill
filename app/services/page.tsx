import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { PracticeStage, type PracticeStageItem } from "@/components/sections/PracticeStage";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { getPractices } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

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

  const stageItems: PracticeStageItem[] = practices.map((practice) => ({
    slug: practice.slug,
    name: practice.name,
    proposition: practice.proposition,
    href: `/services/${practice.slug}`,
    offerings: practice.offerings.map((offering) => ({
      name: offering.name,
      icon: offering.icon,
    })),
    cover: practice.cover,
  }));

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
            <PracticeStage items={stageItems} />
          </div>
        </div>
      </Section>

      <CtaPanel
        eyebrow="Engage"
        heading="Tell us which of the four you think you need."
        intense
      />
    </>
  );
}
