import type { Metadata } from "next";
import { AboutMission } from "@/components/sections/AboutMission";
import { AboutBigPicture } from "@/components/sections/AboutBigPicture";
import { AboutDna } from "@/components/sections/AboutDna";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { LeadershipIndex } from "@/components/sections/LeadershipIndex";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/jsonld";
import { getAbout } from "@/content/about";
import { getDnaPillars } from "@/content/dna";
import { getTeam } from "@/content/team";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Graviti Hill is a business advisory and branding firm founded in Lagos in 2022, built to close the gap between creative thinking and measurable business impact.",
  path: "/about",
});

export default async function AboutPage() {
  const [about, dnaPillars, team] = await Promise.all([
    getAbout(),
    getDnaPillars(),
    getTeam(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          ...team.map(personJsonLd),
          breadcrumbJsonLd([{ name: "About", path: "/about" }]),
        ]}
      />

      <AboutMission />

      <AboutBigPicture />

      <AboutDna pillars={dnaPillars} />

      <LeadershipIndex team={team} />

      <CtaPanel
        eyebrow="Next"
        heading="Bring us the problem you have been deferring."
      />
    </>
  );
}
