import { iconNameSchema, type IconName } from "@/lib/schemas";
import { z } from "zod";

/**
 * THE NAKED BOARD — the proprietary executive coaching platform.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /the-naked-board and the dark teaser on /.
 *
 * This reads as a product, not a service page: a name, a premise, a sequence,
 * an eligibility statement, and a way in.
 */

const stageSchema = z.object({
  name: z.string().min(1),
  icon: iconNameSchema,
  summary: z.string().min(1),
});

const stages = z
  .array(stageSchema)
  .parse([
    {
      name: "Blended Learning Coaching Methods",
      icon: "executive-coaching" satisfies IconName,
      summary:
        "Facilitated sessions, self-directed work and applied practice, sequenced across the programme rather than delivered as a workshop.",
    },
    {
      name: "Design Thinking Tools",
      icon: "innovation" satisfies IconName,
      summary:
        "Structured tooling that moves a divided leadership team from positions to a decision, with the reasoning on record.",
    },
    {
      name: "Executive Mentoring",
      icon: "leadership" satisfies IconName,
      summary:
        "Sustained one-to-one work with the executives carrying the mandate, running alongside the group sessions.",
    },
    {
      name: "Case Studies & Scenario-Based Learning",
      icon: "diagnosis" satisfies IconName,
      summary:
        "Real cases, rehearsed under pressure, so the first time a board runs the decision is not on its own balance sheet.",
    },
    {
      name: "Industry & Subject-Matter Sharing Sessions",
      icon: "stakeholder-engagement" satisfies IconName,
      summary:
        "Closed sessions with operators who have already handled the specific problem in front of the room.",
    },
  ]);

export const NAKED_BOARD = {
  name: "The Naked Board",
  premise:
    "The hardest problems a board faces are the ones nobody will name in the room.",
  positioning: [
    "The Naked Board is Graviti Hill's proprietary executive coaching platform. It exists for boardroom challenges and cultural transformation — succession, founder dependence, a culture that punishes bad news, a board that reviews rather than governs.",
    "It runs as a structured programme with a defined sequence, not a series of one-to-one sessions booked around diaries. The name is the method: the conversation is held without the usual cover.",
  ],
  stages,
  audience: [
    "Boards and executive committees carrying a succession question they have deferred more than once.",
    "Founder-led businesses at the point where the founder's involvement has become the constraint on growth.",
    "Leadership teams inside a transformation where the strategy is agreed and the behaviour has not moved.",
    "Newly constituted boards establishing how they will govern before the first difficult decision arrives.",
  ],
  commitment:
    "Programmes run over a defined term with a fixed cohort. Sessions are closed and unrecorded.",
} as const;
