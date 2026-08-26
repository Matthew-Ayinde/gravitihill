import type { ReactNode } from "react";
import { Marquee } from "@/components/motion/Marquee";
import { NakedBoardField } from "@/components/sections/NakedBoardField";
import { cn } from "@/lib/utils";

/**
 * The opening of /the-naked-board. Same information as the site's shared
 * PageHero (eyebrow, h1, lede, an editorial index) but built as its own
 * component so this one page can carry the instrument-panel treatment
 * (grid, grain, cursor glow — see NakedBoardField) and a status pulse the
 * shared hero has no concept of.
 *
 * The h1 itself stays plain, static text — no entrance, no mask reveal.
 * It's this page's LCP element, same rule the shared PageHero and every
 * headline above the fold on the site already follows.
 */
export function NakedBoardHero({
  eyebrow,
  title,
  lede,
  index,
  ticker,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: ReactNode;
  index: ReadonlyArray<{ label: string; value: string }>;
  ticker: string[];
}) {
  return (
    <NakedBoardField grain className="pt-36 pb-0 lg:pt-44 2xl:pt-56">
      <div className="shell grid-12 gap-y-10 pb-16 lg:pb-20 2xl:pb-24">
        <div className="col-span-12 lg:col-span-8">
          <p className="type-eyebrow flex items-center gap-3 text-accent">
            <StatusPulse />
            {eyebrow}
          </p>
          <h1 className="type-display mt-6 text-h1 text-white">{title}</h1>
        </div>

        <dl className="col-span-12 self-end lg:col-span-3 lg:col-start-10">
          {index.map((item) => (
            <IndexRow key={item.label} label={item.label} value={item.value} />
          ))}
        </dl>

        <div className="col-span-12 lg:col-span-7">
          <p className="measure text-body-lg text-white/75">{lede}</p>
        </div>
      </div>

      <div className="shell relative border-t border-rule-dark py-6">
        <Marquee
          items={ticker}
          itemClassName="type-eyebrow text-white/35"
          speed={30}
        />
      </div>
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

/** One row of the hero's editorial index. Value briefly re-scrambles into
 *  focus on hover/focus — a hairline border brightens, nothing else moves —
 *  pure CSS via `group`, so this costs nothing beyond the shared hero. */
function IndexRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      tabIndex={0}
      className={cn(
        "group flex items-baseline justify-between gap-6 border-t border-rule-dark py-3",
        "outline-none transition-colors duration-300 focus-visible:border-accent",
      )}
    >
      <dt className="type-eyebrow text-white/45 transition-colors duration-300 group-hover:text-accent">
        {label}
      </dt>
      <dd className="type-subhead relative text-body-lg">
        {value}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 ease-brand group-hover:w-full"
        />
      </dd>
    </div>
  );
}
