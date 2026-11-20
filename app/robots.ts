import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { isNoIndex } from "@/lib/site-mode";

export default function robots(): MetadataRoute.Robots {
  // The review deployment is for the client, not for search engines.
  if (isNoIndex()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
