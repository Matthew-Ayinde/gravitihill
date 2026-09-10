import { Entrance } from "@/components/motion/Entrance";
import { PressureHeadline } from "@/components/motion/PressureHeadline";
import { indexNumber } from "@/lib/utils";

/**
 * /insights — the masthead.
 *
 * Type only, no photograph: the first image on the route belongs to the lead
 * piece directly below, and it gets the whole viewport when it arrives. This
 * screen is a publication's front matter — the desk, the headline, how much
 * is on file — and nothing that the sections below will say again.
 *
 * ── What is deliberately absent ──────────────────────────────────────────
 * No dates, categories or article titles: the lead and the archive own those.
 * No Spotlight, ScanLine, HudCorners or CountUp: that is the shared
 * PageHero's language, and this route no longer speaks it.
 *
 * Server component. <PressureHeadline> is the one client island; <Entrance>
 * composes the furniture around it. The section is the headline's pointer
 * field (`data-press-field`), so the type responds anywhere in the hero.
 */
export function InsightsMasthead({ count }: { count: number }) {
  return (
    <section
      data-press-field
      aria-labelledby="insights-heading"
      className="relative flex flex-col bg-canvas pt-32 pb-12 lg:min-h-svh lg:pt-36 lg:pb-16"
    >
      <Entrance className="shell" delay={0.1}>
        <div className="relative flex items-baseline justify-between gap-6 pb-4">
          <p data-load className="type-eyebrow text-green">
            Insights
          </p>
          <p data-load className="type-eyebrow text-ink-muted">
            Lagos / West Africa
          </p>
          <span aria-hidden="true" className="hero-rule absolute inset-x-0 bottom-0 h-px bg-rule" />
        </div>
      </Entrance>

      <div className="shell mt-16 lg:mt-auto lg:pt-16">
        <PressureHeadline
          id="insights-heading"
          className="text-masthead text-ink-display"
          lines={[
            [{ text: "Written to be" }],
            [{ text: "argued with.", className: "text-green" }],
          ]}
        />
      </div>

      <Entrance className="shell mt-12 lg:mt-16" delay={0.6}>
        <div className="grid-12 items-baseline gap-y-6 border-t border-rule pt-8">
          {count > 0 && (
            <p data-load className="type-eyebrow col-span-12 text-ink-muted lg:col-span-4">
              <span className="tabular-nums text-ink">{indexNumber(count - 1)}</span>{" "}
              {count === 1 ? "piece" : "pieces"} on file
            </p>
          )}
          <p
            data-load
            className="measure-tight col-span-12 text-body-lg text-ink-muted lg:col-span-5 lg:col-start-8"
          >
            Short, specific pieces on market entry, brand equity, transformation
            and the boardroom, written from Lagos for businesses operating
            across West Africa.
          </p>
        </div>
      </Entrance>
    </section>
  );
}
