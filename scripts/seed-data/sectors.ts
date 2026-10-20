/** Frozen snapshot of content/sectors.ts — see practices.ts header for why. */

export type SeedSector = {
  slug: string;
  name: string;
  proposition: string;
  thesis: string[];
  position?: { name: string; note: string }[];
  approachHeading?: string;
  differenceHeading?: string;
  differencePoints?: string[];
  practicesHeading?: string;
  practiceNotes?: { name: string; note: string }[];
  hidePractices?: boolean;
  panelPoints?: string[];
  ctaHeading?: string;
  ctaBody?: string;
  ctaLabel?: string;
  approach: { name: string; icon: string; note: string }[];
  differentiators: { name: string; note: string }[];
  imageKey: string;
};

export const SEED_SECTORS: SeedSector[] = [
  {
    slug: "consumer",
    name: "B2C",
    proposition: "From consumer understanding to lasting advocacy",
    thesis: [
      "Lasting advocacy begins with understanding what matters to consumers and delivering on it consistently. Preference, trust and recommendation grow when a brand's promise is reflected in the experience people actually receive.",
      "We work on the whole experience — what the brand promises, what the shelf delivers, what the service recovery says when something goes wrong, because a consumer reads all three as one thing.",
    ],
    panelPoints: [
      "Data-driven consumer insights",
      "Distinctive and relevant brand experiences",
      "Seamless customer engagement and service",
    ],
    position: [
      { name: "Consumer understanding must shape business decisions", note: "Insight creates value when it influences what a business offers, how it competes and how it serves people. Understanding consumers should guide decisions across the organisation, from product development to pricing and service." },
      { name: "Distinctiveness earns attention. Relevance earns a place in people's lives.", note: "A brand needs a recognisable identity and a meaningful reason to be chosen. Its strength lies in connecting what makes it different with something consumers value." },
      { name: "The experience must live up to the promise", note: "Every purchase, interaction and service response shapes what people believe about a brand. When delivery consistently matches expectations, confidence grows into repeat choice and recommendation." },
      { name: "Technology should make the relationship better", note: "Technology earns its place when it helps businesses understand people better and makes their experiences easier, more relevant and more responsive. Its value is measured by the improvement consumers feel." },
      { name: "Advocacy is earned over time", note: "People recommend brands that repeatedly give them a reason to. Sustainable B2C growth depends on continuing to deliver value as consumer needs, expectations and alternatives change." },
    ],
    approach: [
      { name: "Data-driven consumer insights", icon: "insights", note: "We uncover the motivations, habits and barriers that shape buying decisions." },
      { name: "Distinctive brand propositions", icon: "brand-building", note: "Define what makes the brand relevant and different, then express it through compelling ideas and communications." },
      { name: "Consistent customer experiences", icon: "customer-experience", note: "Align people, processes and technology to make choosing, buying and getting support easier." },
    ],
    approachHeading: "How we deliver.",
    differenceHeading: "Where we can make a difference.",
    differencePoints: [
      "Your brand attracts attention but struggles to convert it into sales.",
      "Customers choose you on price and see little reason to stay.",
      "Your customer experience falls short of your brand promise.",
      "Changing consumer expectations are outpacing your response.",
      "You are entering a new market or repositioning for growth.",
    ],
    practicesHeading: "Our B2C services.",
    practiceNotes: [
      { name: "brand-development", note: "We build propositions and experiences that give customers a clear reason to choose." },
      { name: "business-advisory", note: "We align the operating model with the promise made to customers." },
      { name: "market-expansion", note: "We adapt the proposition and route to market to reflect how customers buy." },
    ],
    ctaHeading: "What is holding back your next stage of growth?",
    ctaBody: "Let's explore how deeper consumer understanding can move your business forward.",
    ctaLabel: "Talk to us",
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
    proposition: "Confidence drives business decisions.",
    thesis: [
      "Business buyers need confidence in both the solution they choose and the organisation behind it. We believe sustained B2B growth comes from making value clear, building credibility across the buying group and delivering results that strengthen the relationship over time.",
    ],
    position: [
      { name: "Every buying decision involves different priorities", note: "Leaders, procurement teams and end users judge value differently. A strong proposition gives each a reason to support the decision while building agreement around a shared business outcome." },
      { name: "Value must be clear enough to justify the choice", note: "Expertise becomes commercially compelling when buyers can see how it addresses their priorities. Clear benefits, credible evidence and a realistic understanding of risk make a proposition easier to champion." },
      { name: "Trust grows through delivery", note: "Reputation can open the door, but the working relationship determines what follows. Accountability, responsiveness and consistent performance give clients the confidence to renew, expand and recommend." },
    ],
    approach: [
      { name: "Understand the buying dynamics", icon: "stakeholder-engagement", note: "We examine client priorities, decision-making roles and barriers to purchase to identify what influences selection." },
      { name: "Make the proposition compelling", icon: "brand-building", note: "We connect business capabilities to client outcomes, supported by clear positioning, relevant messaging and credible proof." },
      { name: "Align the promise with performance", icon: "performance", note: "We strengthen the people, processes and technology behind the client experience to support dependable delivery and deeper relationships." },
    ],
    approachHeading: "How we deliver.",
    differenceHeading: "Where we make a difference.",
    differencePoints: [
      "Your expertise is strong, but buyers struggle to see what makes you different.",
      "Your proposition resonates with one stakeholder but fails to secure wider agreement.",
      "You compete heavily on price because your value is difficult to demonstrate.",
      "Your sales promise and client experience do not consistently align.",
      "You want to turn individual contracts into broader, longer-term relationships.",
    ],
    practicesHeading: "Our B2B services.",
    practiceNotes: [
      { name: "business-advisory", note: "We align commercial strategy with the operating capacity required for execution." },
      { name: "capacity-development", note: "We equip leaders to make clear decisions and hold teams accountable." },
      { name: "market-expansion", note: "We prepare the business to enter new markets without weakening operational performance." },
    ],
    ctaHeading: "What is holding back your next stage of growth?",
    ctaBody: "Let's explore how a stronger value proposition and greater buyer confidence can move your business forward.",
    ctaLabel: "Talk to us",
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
    proposition: "Technology and AI only create value when the business can use them.",
    thesis: [
      "The value of technology lies in what it enables a business to do better. Across B2B and B2C, meaningful progress depends on connecting investment to business priorities, applying AI where it improves real work and equipping people to use new tools confidently.",
    ],
    position: [
      { name: "Business-led technology decisions", note: "A clear business need should guide every technology investment. The starting point is understanding which decisions, processes or customer experiences need to improve, then choosing the tools that best support that outcome." },
      { name: "AI applied to real work", note: "AI becomes useful when it addresses specific tasks and challenges within everyday operations. Its contribution should be judged by the quality, speed and effectiveness of the work it supports, with clear accountability for the results." },
      { name: "Capability for adoption", note: "Access to technology is only the beginning. Lasting adoption requires relevant skills, practical support and ways of working that make new tools useful in people's daily roles." },
    ],
    panelPoints: ["Business-Led Technology Decisions", "AI Applied to Real Work", "Capability for Adoption"],
    approach: [
      { name: "Connect investment to business priorities", icon: "strategy", note: "We identify where technology can address operational challenges, improve customer experiences and support growth." },
      { name: "Translate AI potential into practical use", icon: "innovation", note: "We assess opportunities within existing workflows and define applications with clear benefits, responsibilities and measures of success." },
      { name: "Build readiness for change", icon: "people-culture", note: "We align people, processes and skills so teams can adopt new tools and sustain their use." },
    ],
    approachHeading: "How we deliver it.",
    differenceHeading: "Where we make a difference.",
    differencePoints: [
      "You see opportunities in technology and AI but need clarity on where to invest.",
      "You want to move from experimenting with AI to achieving measurable business results.",
      "Your new systems do not fit how your business actually works.",
      "Your teams need the skills and confidence to use technology effectively.",
      "You want your digital investments to improve how you serve business clients and consumers.",
    ],
    hidePractices: true,
    ctaHeading: "What is holding back your next stage of growth?",
    ctaBody: "Let's explore how technology and AI can improve the way you work, serve customers and grow.",
    ctaLabel: "Talk to us",
    differentiators: [
      { name: "Long-term technological partnership", note: "We stay through adoption. The roadmap is reviewed against what shipped, not what was planned." },
    ],
    imageKey: "sector-technology",
  },
];
