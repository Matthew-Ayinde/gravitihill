import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Every route builds its metadata through this helper, so title pattern,
 * canonical and OpenGraph can never drift between pages.
 *
 * Title pattern is `{Page} | Graviti Hill`, applied by the template in the root
 * layout — pass the bare page name here. Home overrides the template with an
 * absolute title.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  authors,
}: {
  title: string;
  description: string;
  /** Route path with a leading slash, e.g. "/services/brand-development". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  const url = `${SITE.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}
