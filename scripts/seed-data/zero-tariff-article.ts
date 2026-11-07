import type { ArticleBlock } from "@/lib/schemas";

/**
 * "Converting China's Zero-Tariff Access into Market Share" — the published
 * text, as it ran on Graviti Hill's LinkedIn (06 July 2026), in block form.
 *
 * The two infographics are image blocks left empty: upload the original
 * files into them from Admin → Insights. Until then they render nothing.
 *
 * Shared by scripts/seed.ts and scripts/update-zero-tariff-insight.ts.
 */

export const ZERO_TARIFF_EXCERPT =
  "Why market access alone is not enough for Nigerian exporters.";

export const ZERO_TARIFF_BODY: ArticleBlock[] = [
  {
    type: "lead",
    text: "China’s zero-tariff window gives Nigerian exporters access, but access alone will not create advantage. The business imperative is to build the readiness required to convert policy opportunity into market share. Between where exporters are today and where they need to be, four strategic priorities will determine who captures the opportunity.",
  },
  {
    type: "p",
    text: "China’s decision to grant zero-tariff access to imports from 53 African countries presents one of the most significant export opportunities available to African economies today. For Nigeria, the policy presents a timely opportunity to expand agricultural exports, diversify foreign exchange earnings, and deepen participation in global value chains.",
  },
  {
    type: "p",
    text: "However, market access alone does not mean the opportunity will be seized. China has removed the tariff barrier, not the readiness barrier. The countries best positioned to benefit are not simply those with products to sell; they are those that have spent years building export systems, regulatory pathways, logistics capacity, buyer relationships, and credible market-facing propositions.",
  },
  {
    type: "p",
    text: "The early signs already show this distinction. Within hours of the policy taking effect, a shipment of 24 metric tons of South African apples cleared customs in Shenzhen as one of the first consignments under the new zero-tariff arrangement. Egypt exported 516 tonnes of oranges to Shanghai, and Kenya exported 24 tonnes of avocados and 319 tonnes of avocado oil to major Chinese ports.",
  },
  {
    type: "p",
    text: "Nigeria’s response paints a different picture. Despite receiving advance notice of the policy, Nigeria missed the day one advantage and only later reported its first zero-tariff shipment, over weeks later, which consisted of a product already traded between both countries – 747 tonnes of cattle bone granules. What this means is Nigeria did not take the opportunity to scale into higher-value segments. As Bismarck Rewane, chief executive officer of Financial Derivatives Company, noted: “The question is not whether demand exists, the question is whether Nigeria can supply consistent quality, volume, and logistics.”",
  },
  {
    type: "p",
    text: "The data suggests the answer is not yet affirmative. Nigeria exported approximately $2.03 billion worth of goods to China in 2024, yet agricultural exports accounted for only $145 million of that total despite the sector contributing roughly one-quarter of national GDP. Products such as cocoa, sesame, ginger, and cashew remain significantly underrepresented in trade flows to China.",
  },
  {
    type: "p",
    text: "Current evidence points to four structural gaps that explain why market access does not automatically translate into market share.",
  },
  {
    type: "image",
    alt: "From Market Access to Market Capture: four structural gaps blocking Nigerian agricultural exporters — fragmented value chain, traceability and documentation, regulatory readiness, and awareness and coordination.",
    size: "wide",
  },
  { type: "h3", text: "1. Fragmented Value Chain" },
  {
    type: "p",
    text: "A significant share of agricultural production remains concentrated among smallholder farmers operating outside integrated export ecosystems. This creates a commercial problem, not just an agricultural one.",
  },
  {
    type: "p",
    text: "When producers, processors, logistics providers, and exporters operate without shared standards or coordinated accountability, quality becomes difficult to control.",
  },
  {
    type: "p",
    text: "For international buyers, especially in high-compliance markets, uncertainty is a risk. They are not only buying cocoa, sesame, ginger, cashew, or shea derivatives, they are buying confidence in the system behind the product.",
  },
  {
    type: "p",
    text: "This is why value-chain fragmentation sits at the root of Nigeria’s export-readiness gap. It weakens the ability of exporters to promise consistent quality, prove origin, aggregate supply, manage standards, and serve large-volume contracts with confidence.",
  },
  { type: "h3", text: "2. Traceability & Documentation" },
  {
    type: "p",
    text: "When the value chain is fragmented, no single actor owns the complete documentation trail. A farmer may know the origin of the crop, an aggregator, the collection point and the processor may know the batch, but unless these details are connected, the exporter cannot present a complete and credible proof system to the buyer.",
  },
  {
    type: "p",
    text: "This creates a serious barrier to scaling. NAFDAC has reported recurring export rejections linked to documentation deficiencies, sanitary and phytosanitary non-compliance, and contamination concerns. Sesame exports, in particular, have experienced elevated rejection rates in international markets.",
  },
  { type: "h3", text: "3. Regulatory Readiness and Certification Access" },
  {
    type: "p",
    text: "Even where product quality exists, regulatory readiness determines whether market access is real or theoretical. Certification, registration, inspection, and compliance requirements are the gateways through which export ambition must pass.",
  },
  {
    type: "p",
    text: "The strategic problem for Nigerian exporters is that compliance is often treated as a one-off administrative task rather than an ongoing business discipline. Documents are assembled when a shipment is due. Certifications are pursued when a buyer asks. Regulatory updates are monitored irregularly. Responsibilities are spread across people without a clear owner.",
  },
  {
    type: "p",
    text: "That model is too reactive for a competitive export environment, regulatory readiness must be institutionalized before the opportunity arrives.",
  },
  { type: "h3", text: "4. Awareness and Coordination" },
  {
    type: "p",
    text: "The final gap is awareness and coordinated execution. Evidence suggests that many Nigerian exporters were either unaware of the policy or insufficiently prepared to respond once it became operational. The Manufacturers Association of Nigeria (MAN) acknowledged limited engagement with government stakeholders, while reports indicated that many exporters lacked clarity regarding market requirements and implementation timelines.",
  },
  { type: "p", text: "This is where market access becomes a strategy issue." },
  {
    type: "p",
    text: "Exporters need more than information. They need market-sensing systems, decision ownership, buyer mapping, opportunity screening, and coordinated execution plans. They need to know which products have demand, which buyers are active, what standards apply, what documentation is required, what partnerships are needed, and what value proposition will make them credible.",
  },
  {
    type: "p",
    text: "Buyer confidence is especially important. They want to know whether the exporter can deliver the same specification repeatedly, respond to documentation requests quickly, manage quality issues transparently, and scale without losing control.",
  },
  {
    type: "p",
    text: "This is where brand becomes more than visual identity. In export markets, brand is the buyer’s perception of credibility, consistency, preparedness, and trust. For Nigerian exporters, the strongest export brands will be those whose promises are backed by systems.",
  },

  { type: "h2", text: "Four Strategic Priorities for Nigerian Exporters" },
  {
    type: "p",
    text: "The companies most likely to benefit from China’s tariff concessions will not necessarily be the largest. They will be the most prepared.",
  },
  { type: "p", text: "Here are four priorities for preparation." },
  { type: "h3", text: "1. Strengthen Value-Chain Integration" },
  {
    type: "p",
    text: "The practical response to fragmentation is coordinated integration, this does not mean every exporter must vertically integrate or own farms, processing facilities, logistics assets, and distribution channels. A ginger exporter, for example, will be better positioned if it works with a defined group of growers under agreed quality specifications than if it sources from multiple intermediaries on a shipment-by-shipment basis. The first model allows for training, documentation, quality planning, and volume forecasting, the second model may provide flexibility but often weakens consistency and traceability.",
  },
  {
    type: "p",
    text: "The strategic objective is to make the value chain legible and manageable. Exporters should be able to answer basic buyer questions with confidence: Where is the product coming from? Who are the suppliers? What standards are they following? How is quality checked? Who is responsible at each stage?",
  },
  { type: "h3", text: "2. Develop Export-Ready Operating Systems" },
  {
    type: "p",
    text: "Traceability requires more than intent. It requires systems that can prove quality, not just claim it.",
  },
  {
    type: "p",
    text: "For a sesame exporter, this could mean maintaining supplier documentation, batch-level records, test results, cleaning and processing records, packaging specifications, and shipment documentation in a format that can be retrieved quickly. For a cocoa exporter, it could include origin records, fermentation and drying standards, quality grading, storage conditions, and buyer-specific documentation packs.",
  },
  {
    type: "p",
    text: "In high-compliance markets, operational discipline becomes a form of competitive advantage.",
  },
  { type: "h3", text: "3. Institutionalize Regulatory Readiness" },
  {
    type: "p",
    text: "To close the certification and regulatory-access gap, exporters need to treat compliance as a continuous capability.",
  },
  {
    type: "p",
    text: "The practical solution is to create a regulatory readiness framework. This should include a compliance calendar, documentation audit process, product-market requirement matrix, certification tracker, buyer requirement checklist, and decision protocol for responding to regulatory changes.",
  },
  {
    type: "p",
    text: "For Nigerian businesses, this is where advisory support can create value. The technical certification may come from regulators or accredited bodies, but the business architecture that supports readiness must be designed, owned, and managed by the exporter.",
  },
  { type: "h3", text: "4. Build Market Intelligence and Buyer-Facing Positioning" },
  {
    type: "p",
    text: "To close the awareness and coordination gap, exporters need a structured market intelligence capability linked directly to commercial execution.",
  },
  {
    type: "p",
    text: "Market intelligence should not be passive. It should not be limited to reading policy announcements or attending trade events. It should help the business make decisions before opportunities become obvious.",
  },
  {
    type: "p",
    text: "An exporter should know which Chinese buyers are relevant, which product categories are gaining demand, what competing African suppliers are offering, what specifications buyers require, what price and volume expectations exist, and what internal changes are needed to participate credibly.",
  },
  {
    type: "p",
    text: "But intelligence alone is not enough, exporters must also build a credible buyer-facing proposition.",
  },
  { type: "p", text: "A strong export proposition answers five questions clearly:" },
  {
    type: "list",
    ordered: true,
    items: [
      "What the company supplies.",
      "What standards it meets",
      "What volumes it can sustain",
      "What proof it can provide",
      "Why should the buyer trust it?",
    ],
  },
  { type: "p", text: "This is where brand and business strategy converge." },
  {
    type: "image",
    alt: "The Export Readiness Ladder: four strategic priorities for converting zero-tariff access into market share — strengthen value-chain integration, develop export-ready operating systems, institutionalize regulatory readiness, and build market intelligence and buyer-facing positioning.",
    size: "wide",
  },
  {
    type: "p",
    text: "South Africa spent a decade building cold-chain logistics and bilateral agricultural protocols. Egypt developed the Horticultural Export Improvement Association’s certification system, with Chinese officials conducting on-site inspections and farmers receiving training to meet Chinese standards. Kenya built packhouses within hours of Nairobi’s international airport and developed air-freight capability. That distinction is the difference between market access and market capture.",
  },

  { type: "h2", text: "The Imperative for Nigerian Exporters" },
  {
    type: "p",
    text: "China’s zero-tariff policy has exposed the difference between access and advantage. What remains unresolved is exporters’ ability to convert that opportunity into trust, preference, and repeatable commercial outcomes. The gap between what China’s zero-tariff access could be worth to Nigerian exporters and what they are currently positioned to capture reveals a clear problem. But it is a solvable one, only by businesses that understand the urgency of building brands that are export-ready",
  },
  { type: "p", text: "*Written by Graviti Hill, July 2026.*" },
];
