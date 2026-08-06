import { notFound } from "next/navigation";
import { getInsights, getInsight } from "@/content/insights";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { editorialDate } from "@/lib/utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill insight";

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  return ogImage({
    eyebrow: insight.category,
    title: insight.title,
    footnote: `${editorialDate(insight.publishedAt)} · ${insight.readingTime} min read`,
  });
}
