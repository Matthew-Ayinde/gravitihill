import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill insights";

export default async function Image() {
  return ogImage({
    eyebrow: "Insights",
    title: "Positions, not commentary.",
  });
}
