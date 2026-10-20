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
    <Studio hill id="mission" labelledBy="about-mission">
      <Entrance className="shell grid-12 items-start gap-y-14" delay={0.15}>
        {/* Left margin: the section's index, as editorial furniture. */}
        <div className="col-span-12 lg:col-span-2">
          <p data-load className="type-eyebrow flex items-center gap-4 text-ink-muted">
            <span className="text-green">01.</span>
            <span className="whitespace-nowrap">The gap we are <br /> built to close</span>
           </p>
        </div>

        {/* The statement. */}
        <div className="col-span-12 lg:col-span-7">
          <h1
            data-load="mask"
            id="about-mission"
            className="type-display text-hero"
          >
            <span className="block text-ink-display">Building businesses,</span>
            <span className="block text-green">beyond their current limit</span>
          </h1>
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
