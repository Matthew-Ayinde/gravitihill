import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill sectors — Consumer, B2B and Technology";

export default async function Image() {
  return ogImage({
    eyebrow: "Sectors",
    title: "Consumer. B2B. Technology.",
  });
}
