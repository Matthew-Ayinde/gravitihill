import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact Graviti Hill — Victoria Island, Lagos";

export default async function Image() {
  return ogImage({
    eyebrow: "Contact",
    title: "Start a conversation.",
    footnote: "Victoria Island, Lagos",
  });
}
