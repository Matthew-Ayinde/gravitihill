import type { ReactNode } from "react";
import { Entrance } from "@/components/motion/Entrance";
import { Marquee } from "@/components/motion/Marquee";
import { NakedBoardField } from "@/components/sections/NakedBoardField";

/**
 * The opening of /the-naked-board. Same information as the site's shared
 * PageHero (eyebrow, h1, lede) but built as its own
 * component so this one page can carry the instrument-panel treatment
 * (grid, grain, cursor glow — see NakedBoardField) and a status pulse the
 * shared hero has no concept of.
 *
 * Composes itself on load through <Entrance>, in the same order as the
 * shared PageHero: eyebrow, the h1 wiping up, lede, then the ticker.
 * The Entrance wrapper is `display: contents`, so NakedBoardField lays its
 * children out exactly as before.
 */
export function NakedBoardHero({
  eyebrow,
  title,
  lede,
  ticker,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  ticker: string[];
}) {
  return (
    <NakedBoardField grain className="pt-36 pb-0 lg:pt-44 2xl:pt-56">
      <Entrance className="contents" delay={0.15}>
        <div className="shell grid-12 gap-y-10 pb-16 lg:pb-20 2xl:pb-24">
          <div className="col-span-12 lg:col-span-8">
            <p data-load className="type-eyebrow flex items-center gap-3 text-accent">
              <StatusPulse />
              {eyebrow}
            </p>
            <h1 data-load="mask" className="type-display mt-6 text-h1 text-white">
              {title}
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <p data-load className="measure text-body-lg text-white/75">
              {lede}
            </p>
          </div>
        </div>

        <div data-load className="shell relative border-t border-rule-dark py-6">
          <Marquee
            items={ticker}
            itemClassName="type-eyebrow text-white/35"
            speed={30}
          />
        </div>
      </Entrance>
    </NakedBoardField>
  );
}

/** A live/forming status dot — a solid core with a soft expanding ring,
 *  both built from Tailwind's stock `animate-ping`/nothing-extra keyframes
 *  rather than a bespoke one. Neutralised sitewide under reduced motion. */
function StatusPulse() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
    </span>
  );
}
