import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { PageFade } from "@/components/motion/PageFade";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/jsonld";
import { SITE } from "@/lib/site";

/**
 * Archivo carries both a weight axis (100–900) and a width axis (62–125), so a
 * single superfamily reproduces Acumin's Extra Condensed / Semi Condensed /
 * Normal system exactly — one file, three widths, no mismatched pairing.
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // /admin is a tool, not a marketing surface — middleware flags every
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

  const orgJsonLd = await organizationJsonLd();

  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
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
            <SiteHeader />
            <PageFade>{children}</PageFade>
            <SiteFooter />
          </MotionRoot>
        </div>
      </body>
    </html>
  );
}
