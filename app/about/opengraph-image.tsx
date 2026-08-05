import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About Graviti Hill — founded in Lagos, 2022";

export default async function Image() {
  return ogImage({
    eyebrow: "About",
    title: "Re-definers of Brand Building.",
    footnote: "Founded 2022 · Lagos",
  });
}
