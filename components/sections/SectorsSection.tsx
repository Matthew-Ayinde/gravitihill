import Image from "next/image";
import { SectorsPanel, type SectorPanelItem } from "@/components/sections/SectorsPanel";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { ParallaxFrame } from "@/components/ui/ParallaxFrame";
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
      <span key={step.name} className="flex items-center gap-4">
        <Icon name={step.icon} className="h-6 w-6 shrink-0 text-white" />
        <span className="text-white/75">{step.name}</span>
      </span>
    )),
  }));

  return <SectorsPanel items={items} index={index} />;
}

/**
 * Full-bleed, not boxed. §5.2 calls this "the full-bleed sector image" — the
 * client panel now pins it edge-to-edge for the full height of the viewport
 * rather than a contained 3:2 plate, so this renders to fill whatever box its
 * parent gives it rather than declaring its own aspect ratio.
 *
 * That means it can't route through <EditorialImage>, which enforces a fixed
 * 3:2/4:5 ratio for every other image on the site — this is the one place the
 * brief explicitly asks for the exception. It keeps the same grade (the
 * --abyss tint), the same ambient-video and blur-placeholder handling, and
 * the same ParallaxFrame drift as everywhere else, just unboxed.
 *
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
      <div className="relative h-full w-full overflow-hidden">
        <ParallaxFrame>
          {sector.image.video ? (
            <AmbientVideo
              image={{ ...sector.image, video: sector.image.video }}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={sector.image.src}
              alt={sector.image.alt}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
              {...(sector.image.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: sector.image.blurDataURL }
                : {})}
            />
          )}
        </ParallaxFrame>
        {/* Consistent grade across a mismatched library — same treatment as
            EditorialImage's dark-tone overlay. */}
        <div aria-hidden="true" className="absolute inset-0 bg-ridge/14" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-end justify-between bg-white/6 p-10 ring-1 ring-inset ring-rule-dark">
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
