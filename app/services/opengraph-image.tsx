import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill services — four practices, one bench";

export default async function Image() {
  return ogImage({
    eyebrow: "Services",
    title: "Four practices, staffed from one bench.",
  });
}
