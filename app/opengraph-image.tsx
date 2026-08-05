import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Graviti Hill — business advisory and brand building, Lagos";

export default async function Image() {
  return ogImage({
    eyebrow: "Business advisory & brand building",
    title: "We build and sustain future-forward businesses.",
  });
}
