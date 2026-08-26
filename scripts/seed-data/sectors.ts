/** Frozen snapshot of content/sectors.ts — see practices.ts header for why. */

export type SeedSector = {
  slug: string;
  name: string;
  proposition: string;
  thesis: string[];
  approach: { name: string; icon: string; note: string }[];
  differentiators: { name: string; note: string }[];
  imageKey: string;
};

export const SEED_SECTORS: SeedSector[] = [
  {
    slug: "consumer",
    name: "Consumer",
    proposition: "From passive consumers to raving fans.",
    thesis: [
      "Consumer brands in this market compete on distribution and price until one of them earns a reason to be chosen. That reason is built, not discovered.",
      "We work on the whole experience — what the brand promises, what the shelf delivers, what the service recovery says when something goes wrong, because a consumer reads all three as one thing.",
    ],
    approach: [
      { name: "Holistic brand experience", icon: "customer-experience", note: "Every touchpoint designed against one standard, from packaging to complaint handling." },
      { name: "Personalised message formats", icon: "brand-building", note: "Segment-specific creative, built from behavioural data rather than assumed personas." },
      { name: "Multi-channel engagement", icon: "stakeholder-engagement", note: "Retail, broadcast, social and trade planned as one system with one measurement frame." },
    ],
    differentiators: [
      { name: "Data-driven consumer insight", note: "Segmentation and tracking built in at the brief, so the creative argument has evidence behind it." },
      { name: "Creative brand anchors", note: "A small number of durable assets the market recognises, held consistently for years." },
      { name: "Seamless customer engagement", note: "One continuous conversation across channels rather than four disconnected campaigns." },
    ],
    imageKey: "sector-consumer",
  },
  {
    slug: "b2b",
    name: "B2B",
    proposition: "Robust lead generation frameworks.",
    thesis: [
      "B2B growth stalls where marketing and operations are run as separate functions. The pipeline fills and the delivery cannot carry it, or delivery is excellent and nobody knows.",
      "We build the demand engine and the operating capacity to serve it in the same engagement, which is why our advisory practice sits inside this work rather than beside it.",
    ],
    approach: [
      { name: "Advisory and lead generation, integrated", icon: "value-chain", note: "The commercial strategy and the demand engine designed by one team, against one plan." },
      { name: "Customised operational efficiency", icon: "process-optimisation", note: "Process redesign sized to what the pipeline will actually deliver." },
      { name: "Account and stakeholder mapping", icon: "stakeholder-engagement", note: "Buying committees identified properly — influence and authority are rarely the same person." },
    ],
    differentiators: [
      { name: "Synergy with the advisory practice", note: "Demand generation designed alongside the operating model that has to fulfil it." },
      { name: "Customised scalability", note: "Frameworks built to the client's capacity today and their intended capacity in three years." },
      { name: "Continuous improvement", note: "Quarterly review cycles with named owners, not an annual retrospective." },
    ],
    imageKey: "sector-b2b",
  },
  {
    slug: "technology",
    name: "Technology",
    proposition: "Tailored brand building powered by technology.",
    thesis: [
      "Technology businesses are usually clear on the product and unclear on the story. The category is new, the buyer is unfamiliar, and the brand has to do the explaining.",
      "We build the positioning and the technical roadmap together, and stay through the adoption curve rather than leaving at launch.",
    ],
    approach: [
      { name: "Technology integration & optimisation", icon: "innovation", note: "Audit the stack, remove what duplicates, and integrate what should have been talking." },
      { name: "Custom technology roadmaps", icon: "strategy", note: "A sequenced build plan tied to commercial milestones, not to a vendor's release calendar." },
      { name: "Innovation and adaptation", icon: "execution", note: "A standing capability for testing and adopting change, rather than a one-off transformation." },
    ],
    differentiators: [
      { name: "Long-term technological partnership", note: "We stay through adoption. The roadmap is reviewed against what shipped, not what was planned." },
    ],
    imageKey: "sector-technology",
  },
];
