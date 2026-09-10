import type { Metadata } from "next";
import { SectorsHero } from "@/components/sections/SectorsHero";
import { SectorApproach } from "@/components/sections/SectorApproach";
import { getSectors } from "@/content/sectors";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sectors",
  description:
    "Consumer, B2B and Technology — three sectors, each with its own proposition, strategic approach and point of difference.",
  path: "/sectors",
});

/**
 * Each block has one job and shares no content with the others:
 *   hero      what each sector is — photograph, proposition, differentiators
 *   approach  how the work is run — thesis and approach steps
 *   footer    how to reach us — its own "Start a conversation" band, email
 *             and all three numbers
 *
 * Two things other routes carry are deliberately absent here:
 * · The pinned signature panel stays on the home route, where it is the only
 *   sector content; here it would restate the hero's photographs and
 *   propositions a scroll later.
 * · <CtaPanel>. The footer's call to action and contact block follow the
 *   approach section directly, so a CtaPanel would put two calls to action
 *   and the same phone and email on screen back to back.
 */
export default async function SectorsPage() {
  const sectors = await getSectors();
  return (
    <>
      <SectorsHero
        sectors={sectors}
        lede="We do not run one playbook across every category. What wins in consumer does not transfer to a B2B pipeline, and neither transfers to a technology business explaining a new category to its own market."
      />

      <SectorApproach sectors={sectors} />
    </>
  );
}
