/**
 * Which face of the site a deployment shows, set per deployment with the
 * `SITE_MODE` environment variable. One codebase, one `main` branch: two
 * Vercel projects built from it differ only in this value.
 *
 *   coming-soon  The construction screen on every public route. The default,
 *                so a deployment with nothing set can never leak the site.
 *   review       The full site, hidden from search engines (noindex header,
 *                robots meta, robots.txt disallow). For the client preview.
 *   live         The full site, indexed. Launch day: set this on production.
 *
 * Read on the server only (layout, robots.ts, next.config). Changing it on
 * Vercel takes effect on the next deployment.
 */
export type SiteMode = "coming-soon" | "review" | "live";

const MODES: readonly SiteMode[] = ["coming-soon", "review", "live"];

export function getSiteMode(): SiteMode {
  const value = process.env.SITE_MODE?.trim().toLowerCase();
  return MODES.includes(value as SiteMode) ? (value as SiteMode) : "coming-soon";
}

/** True when public routes should render the Coming Soon screen. */
export const isComingSoon = () => getSiteMode() === "coming-soon";

/** True when the deployment must stay out of search indexes. */
export const isNoIndex = () => getSiteMode() === "review";
