import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { PracticeStage, type PracticeStageItem } from "@/components/sections/PracticeStage";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPractices } from "@/content/services";
import { serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const practices = await getPractices();
  return pageMetadata({
    title: "Services",
    description: `${practices.length} practices (${listNames(practices.map((p) => p.name))}) staffed from one bench in Lagos.`,
    path: "/services",
  });
}

/** "A, B, C and D" */
function listNames(names: string[]): string {
  return names.length < 2
    ? names.join("")
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default async function ServicesPage() {
  const practices = await getPractices();

  const stageItems: PracticeStageItem[] = practices.map((practice) => ({
    slug: practice.slug,
    name: practice.name,
    proposition: practice.proposition,
    offerings: practice.offerings.map((offering) => ({
      name: offering.name,
      icon: offering.icon,
    })),
    cover: practice.cover,
  }));

  return (
    <>
      <JsonLd data={practices.map(serviceJsonLd)} />
      <PageHero
        eyebrow="Services"
        title={
          <>
            Business growth demands more than{" "}
            <span className="accent-word">one discipline.</span>
          </>
        }
        lede="Growth stalls when business strategy and brand promise move in different directions. Our practices work as one to turn ambition into measurable performance."
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
        heading="Tell us about your business challenge."
        intense
      />
    </>
  );
}
