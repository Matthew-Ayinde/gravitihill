/** Frozen snapshot of content/dna.ts — see practices.ts header for why. */

export type SeedPillar = { name: string; icon: string; summary: string; detail: string };

export const SEED_PILLARS: SeedPillar[] = [
  {
    name: "Strategically Creative",
    icon: "strategy",
    summary: "Creative work that carries a commercial argument.",
    detail:
      "Ideas are cheap in this market and good ones are common. What is rare is a creative decision that can be defended in a board paper. Every piece of work we produce has to survive that test before it goes out.",
  },
  {
    name: "Efficiency-Driven Innovation",
    icon: "innovation",
    summary: "New methods judged on what they remove, not what they add.",
    detail:
      "Innovation that increases cost and complexity is a liability. We introduce new tools, technology and process where they take steps out of the operation, and we measure whether they did.",
  },
  {
    name: "Holistic Systems Approach",
    icon: "process-optimisation",
    summary: "The brand, the operating model and the people, treated as one system.",
    detail:
      "A brand problem is usually an operations problem wearing a marketing budget. We diagnose across the whole system, which is why our advisory and brand practices are staffed from the same bench.",
  },
  {
    name: "People-Centric",
    icon: "people-culture",
    summary: "The strategy is only as good as the people asked to run it.",
    detail:
      "Capability, incentive and behaviour decide whether a plan is executed or shelved. We design for the organisation that exists, then build toward the one the strategy needs.",
  },
];
