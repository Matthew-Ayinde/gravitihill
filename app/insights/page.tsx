import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { InsightsIndex, type FilterableRow } from "@/components/sections/InsightsIndex";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { INSIGHTS, INSIGHT_CATEGORIES } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";
import { editorialDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Written positions on market expansion, brand building, business advisory and leadership in Nigeria and West Africa.",
  path: "/insights",
});

export default function InsightsPage() {
  // Rows are built and rendered here, on the server. The client component
  // receives elements plus a category string — never the content module.
  const rows: FilterableRow[] = INSIGHTS.map((insight) => ({
    id: insight.slug,
    href: `/insights/${insight.slug}`,
    category: insight.category,
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
  }));

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          <>
            Positions, not{" "}
            <span className="accent-word">commentary.</span>
          </>
        }
        lede="We publish when we have something specific to argue. Each of these takes a position a reader could disagree with."
        index={[
          { label: "Articles", value: String(INSIGHTS.length) },
          { label: "Categories", value: String(INSIGHT_CATEGORIES.length) },
        ]}
      />

      <Section className="pt-0">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">Index</SectionLabel>
            <SectionLabelInline index="01">Index</SectionLabelInline>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <InsightsIndex items={rows} categories={INSIGHT_CATEGORIES} />
          </div>
        </div>
      </Section>

      <CtaPanel eyebrow="Engage" heading="Disagree with one of these? Say so." />
    </>
  );
}
