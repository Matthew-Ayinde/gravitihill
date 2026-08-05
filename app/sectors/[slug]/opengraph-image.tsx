import { notFound } from "next/navigation";
import { SECTORS, getSector } from "@/content/sectors";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill sector";

export function generateStaticParams() {
  return SECTORS.map((sector) => ({ slug: sector.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  return ogImage({
    eyebrow: `Sectors / ${sector.name}`,
    title: sector.proposition,
  });
}
