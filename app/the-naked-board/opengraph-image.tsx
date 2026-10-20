import { getPractices } from "@/content/services";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Naked Board — capacity development platform by Graviti Hill";

export default async function Image() {
  // The practice that hosts the platform is the one with a platform link.
  const practices = await getPractices();
  const host = practices.find((p) => p.platformHref) ?? practices.find((p) => p.slug === "executive-coaching");
  return ogImage({
    eyebrow: "A Graviti Hill platform",
    title: "The Naked Board.",
    footnote: `${host?.name ?? "Capacity Development"} · Lagos`,
  });
}
