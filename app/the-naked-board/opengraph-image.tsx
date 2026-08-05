import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Naked Board — executive coaching platform by Graviti Hill";

export default async function Image() {
  return ogImage({
    eyebrow: "A Graviti Hill platform",
    title: "The Naked Board.",
    footnote: "Executive coaching · Lagos",
  });
}
