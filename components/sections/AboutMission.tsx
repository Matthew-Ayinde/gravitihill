import { Studio } from "@/components/sections/Studio";
import { Entrance } from "@/components/motion/Entrance";

/**
 * /about §01 — the mission statement, standing in the studio.
 *
 * A server component: it owns the copy and the layout; <Studio> is the only
 * client island for the room. No content crosses to the browser that the
 * server has not already rendered.
 *
 * ── Why the <h1> is here and not in a shared hero ────────────────────────
 * The route's h1 is the statement itself, set flat at display scale.
 *
 * ── On load ──────────────────────────────────────────────────────────────
 * <Entrance> composes the section in reading order: the index, the statement
 * wiping up, then the right column line by line.
 *
 * ── The colour break is the emphasis ─────────────────────────────────────
 * "Founded 2022," lands in --ink, the rest in --green: the sentence changes
 * colour at its turn. That replaces the accent-word device used elsewhere on
 * the site — at this scale an underline or a highlighted word would be
 * noise, and the tonal break does the same job with more authority.
 */
export function AboutMission() {
  return (
    <Studio hill labelledBy="about-mission">
      <Entrance className="shell grid-12 items-start gap-y-14" delay={0.15}>
        {/* Left margin: the section's index, as editorial furniture. */}
        <div className="col-span-12 lg:col-span-2">
          <p data-load className="type-eyebrow flex items-center gap-4 text-ink-muted">
            <span className="text-green">01.</span>
            <span className="whitespace-nowrap">Our mission</span>
            <span aria-hidden="true" className="h-px w-10 bg-rule lg:w-6" />
          </p>
        </div>

        {/* The statement. */}
        <div className="col-span-12 lg:col-span-7">
          <h1
            data-load="mask"
            id="about-mission"
            className="type-display text-display-xl"
          >
            <span className="block text-ink-display">Founded 2022,</span>
            <span className="block text-green">on a specific</span>
            <span className="block text-green">frustration.</span>
          </h1>
        </div>

        {/* Right column: tight, quiet, deliberately narrow. */}
        <div className="col-span-12 lg:col-span-3">
          <p data-load className="type-eyebrow text-green">
            Graviti Hill
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            The gap we are built to close
          </p>

          {/* Deliberately does not state the §02 headline. The two sections
              share a subject; repeating the sentence would spend the payoff
              early and read as a page that forgot what it had said. */}
          <p data-load className="measure-tight mt-6 text-ink-muted">
            Creative thinking and commercial impact were being run as
            separate conversations, by separate people, usually in separate
            buildings. The strategy deck said one thing, the operating model
            permitted another, and the brand promised a third.
          </p>

          <p data-load className="measure-tight mt-5 text-ink-muted">
            Graviti Hill was built in Lagos in 2022 to close that gap — to
            put the thinking and the commercial consequence of it on the
            same table, in front of the same people.
          </p>

          <p data-load className="type-eyebrow mt-10 flex items-center gap-4 text-ink-muted">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule"
            >
              →
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-rule" />
            Strategy / Brand / Growth
          </p>
        </div>
      </Entrance>
    </Studio>
  );
}
