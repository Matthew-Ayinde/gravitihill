import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { PageFade } from "@/components/motion/PageFade";
import { SplashScreen } from "@/components/motion/SplashScreen";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { getHomeHeroMedia } from "@/lib/home-hero";
import { SITE, buildNav } from "@/lib/site";
import { getPractices } from "@/content/services";
import { getSectors } from "@/content/sectors";
import { SPLASH_BOOT } from "@/lib/splash-session";

/**
 * Archivo carries both a weight axis (100-900) and a width axis (62-125), so a
 * single superfamily reproduces Acumin's Extra Condensed / Semi Condensed /
 * Normal system exactly: one file, three widths, no mismatched pairing.
 *
 * Declaring `axes: ["wdth"]` keeps this to a single variable font download.
 * Swap path to real Acumin is documented in README §Typography and touches only
 * two CSS variables.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Graviti Hill | Business Advisory & Brand Building, Lagos",
    template: "%s | Graviti Hill",
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/**
 * Runs during HTML parsing, before first paint: marks the document so CSS
 * holds every on-load entrance element hidden until <Entrance> takes over at
 * hydration. Without it, server HTML paints, vanishes, then animates back in.
 * Skipped under reduced motion, where there is no entrance to hold for.
 */
const MOTION_BOOT = `(function(){try{if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-motion-boot","")}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // /admin is a tool, not a marketing surface. Middleware flags every
  // request under it with `x-is-admin` so this single root layout can skip
  // SiteHeader/SiteFooter/MotionRoot/the Organization JSON-LD for it, rather
  // than restructuring the whole app directory into two root layouts.
  const isAdmin = (await headers()).get("x-is-admin") === "1";

  if (isAdmin) {
    return (
      <html lang="en" className={`${archivo.variable} h-full`}>
        <body className="min-h-full">{children}</body>
      </html>
    );
  }

  const [orgJsonLd, homeHero, practices, sectors] = await Promise.all([
    organizationJsonLd(),
    getHomeHeroMedia(),
    getPractices(),
    getSectors(),
  ]);
  // Only slug + name cross into the client header/splash, not whole documents.
  const practiceNames = practices.map(({ slug, name }) => ({ slug, name }));
  const sectorNames = sectors.map(({ slug, name }) => ({ slug, name }));

  return (
    // suppressHydrationWarning: MOTION_BOOT / SPLASH_BOOT add attributes before React
    // hydrates. It covers <html>'s own attributes only, not its children.
    <html lang="en" className={`${archivo.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: SPLASH_BOOT }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Organization + ProfessionalService, emitted once for every route. */}
        <JsonLd data={orgJsonLd} />
        <div className="flex min-h-full flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-green focus:px-5 focus:py-3 focus:text-white"
          >
            Skip to content
          </a>
          <MotionRoot>
            {/* SiteHeader is global and route-agnostic; it can't fetch the
                home page's content itself. Whether "/" has a dark background
                is admin-configurable content, not a fact about the route,
                so it's read here (once, cached, for every route) and handed
                down — the same way DARK_HERO_ROUTES flags a fully-dark page
                like /the-naked-board, just resolved from data instead of a
                hardcoded list. */}
            <SiteHeader
              homeHeroHasMedia={homeHero.items.length > 0}
              nav={buildNav({ practices: practiceNames, sectors: sectorNames })}
            />
            <PageFade>{children}</PageFade>
            <SiteFooter />
            {/* Sibling of PageFade, not a descendant: see SplashScreen's
                header comment for why it can't live inside the tilted
                page wrapper. */}
            <SplashScreen practices={practiceNames} />
          </MotionRoot>
        </div>
      </body>
    </html>
  );
}
