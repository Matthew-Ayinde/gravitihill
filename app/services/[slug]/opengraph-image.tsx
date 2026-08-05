import { notFound } from "next/navigation";
import { PRACTICES, getPractice } from "@/content/services";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill practice";

export function generateStaticParams() {
  return PRACTICES.map((practice) => ({ slug: practice.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();

  return ogImage({
    eyebrow: "Services",
    title: practice.name,
    footnote: `${practice.offerings.length} services · Lagos`,
  });
}
