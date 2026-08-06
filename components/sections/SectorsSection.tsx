import { SectorsPanel, type SectorPanelItem } from "@/components/sections/SectorsPanel";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Icon } from "@/components/icons";
import { getSectors } from "@/content/sectors";
import type { Sector } from "@/lib/schemas";
import { indexNumber } from "@/lib/utils";

/**
 * Server half of the signature panel.
 *
 * It reads the content module, renders the visuals and the approach points to
 * finished elements, and hands those to the client component. That keeps the
 * content module, the icon set and Zod out of the client bundle entirely — the
 * client only receives what the interaction actually manipulates.
 */
export async function SectorsSection({ index = "04" }: { index?: string }) {
  const sectors = await getSectors();
  const items: SectorPanelItem[] = sectors.map((sector, i) => ({
    slug: sector.slug,
    name: sector.name,
    href: `/sectors/${sector.slug}`,
    proposition: sector.proposition,
    visual: <SectorVisual sector={sector} position={i} />,
    points: sector.approach.map((step) => (
      <span key={step.name} className="flex items-center gap-3">
        <Icon name={step.icon} className="h-5 w-5 shrink-0 text-white" />
        <span className="text-white/75">{step.name}</span>
      </span>
    )),
  }));

  return <SectorsPanel items={items} index={index} />;
}

/**
 * With photography absent — the expected state — this is a typographic plate
 * carrying the sector numeral, consistent with how leadership monograms stand
 * in for headshots. Real imagery drops in through `sector.image` with no
 * layout change.
 */
function SectorVisual({
  sector,
  position,
}: {
  sector: Sector;
  position: number;
}) {
  if (sector.image) {
    return (
      <EditorialImage
        image={sector.image}
        tone="dark"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="h-full"
      />
    );
  }

  return (
    <div className="flex aspect-3/2 h-full w-full items-end justify-between bg-white/6 p-8 ring-1 ring-inset ring-rule-dark">
      <span className="type-eyebrow text-white/45">
        {sector.name} — West Africa
      </span>
      <span
        aria-hidden="true"
        className="type-display text-hero leading-none text-white/10"
      >
        {indexNumber(position)}
      </span>
    </div>
  );
}
