import { Studio } from "@/components/sections/Studio";
import { Entrance } from "@/components/motion/Entrance";
import { GapCrossing } from "@/components/sections/GapCrossing";

/**
 * /about §01 — the mission statement, standing in the studio.
 *
 * A server component: it owns the copy and the layout; <Studio> is the only
 * client island for the room. No content crosses to the browser that the
 * server has not already rendered.
 *
 * ── The statement is drawn, not set ──────────────────────────────────────
 * The route's h1 is the statement itself, kept sr-only; what the eye gets is
 * <GapCrossing> — two cliffs and the dashed route across the gap between
 * them. The cliffs replace the studio's wedge, so the room is built without
 * `hill`: one piece of terrain per page.
 *
 * ── On load ──────────────────────────────────────────────────────────────
 * <Entrance> composes the section in reading order: the index, the drawing
 * rising in (its route then draws itself), then the right column.
 */
export function AboutMission() {
  return (
    <Studio id="mission" labelledBy="about-mission">
      <Entrance className="shell grid-12 items-start gap-y-14" delay={0.15}>
        {/* Left margin: the section's index, as editorial furniture. */}
        <div className="col-span-12 lg:col-span-2">
          <p data-load className="type-eyebrow flex items-center gap-4 text-ink-muted">
            <span className="text-green">01.</span>
            <span className="whitespace-nowrap">The gap we are <br /> built to close</span>
           </p>
        </div>

        {/* The statement, drawn: two cliffs and the route across the gap.
            The sentence stays as the route's h1 for readers and search; the
            figure says it to everyone else. */}
        <div className="col-span-12 lg:col-span-7">
          <h1 id="about-mission" className="sr-only">
            Building businesses, beyond their current limit
          </h1>
          <div data-load>
            <GapCrossing />
          </div>
        </div>

        {/* Right column: tight, quiet, deliberately narrow. */}
        <div className="col-span-12 lg:col-span-3">
          {/* Deliberately does not state the §02 headline. The two sections
              share a subject; repeating the sentence would spend the payoff
              early and read as a page that forgot what it had said. */}
          <p data-load className="measure-tight mt-6 text-ink-muted">
            We challenge inherited assumptions and redesign what no longer serves a business’s future. Translating growth ambitions into the strategy, operating models and commercial capabilities needed to compete and scale.
          </p>

          <p data-load className="measure-tight mt-5 text-ink-muted">
           Through clear accountability, management routines and a culture of learning, we make these changes part of our everyday work. This embeds the discipline to adapt faster, perform consistently and sustain growth.

          </p>

         
        </div>
      </Entrance>
    </Studio>
  );
}
