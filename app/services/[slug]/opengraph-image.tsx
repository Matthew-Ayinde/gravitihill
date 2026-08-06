import { notFound } from "next/navigation";
import { getPractices, getPractice } from "@/content/services";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill practice";

export async function generateStaticParams() {
  const practices = await getPractices();
  return practices.map((practice) => ({ slug: practice.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = await getPractice(slug);
  if (!practice) notFound();

  return ogImage({
    eyebrow: "Services",
    title: practice.name,
    footnote: `${practice.offerings.length} services · Lagos`,
  });
}
