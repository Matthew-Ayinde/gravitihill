import { notFound } from "next/navigation";
import { getSectors, getSector } from "@/content/sectors";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill sector";

export async function generateStaticParams() {
  const sectors = await getSectors();
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();

  return ogImage({
    eyebrow: `Sectors / ${sector.name}`,
    title: sector.proposition,
  });
}
