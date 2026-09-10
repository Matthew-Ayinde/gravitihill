import type { Metadata } from "next";
import { InsightsMasthead } from "@/components/sections/InsightsMasthead";
import { InsightsLead } from "@/components/sections/InsightsLead";
import { InsightsArchive } from "@/components/sections/InsightsArchive";
import { InsightsReply } from "@/components/sections/InsightsReply";
import { getInsights } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Insights",
  description:
    "Written positions on market expansion, brand building, business advisory and leadership in Nigeria and West Africa.",
  path: "/insights",
});

/**
 * /insights is composed as a publication, and each piece appears once:
 *
 *   masthead   the desk and the headline — no article content at all
 *   lead       the newest piece, alone, at the size of the screen
 *   archive    every piece after it, as a filterable stack of files
 *   reply      how to answer one of them
 *
 * Each section carries its own motion device and none is borrowed from
 * another route: axis-driven type, a scrubbed aperture, a receding stack, a
 * statement that inks in as it is read.
 */
export default async function InsightsPage() {
  // Newest first, as the repository returns them. Issue numbers run the
  // other way: the newest piece carries the highest number.
  const insights = await getInsights();
  const numbered = insights.map((insight, i) => ({ insight, issue: insights.length - i }));
  const [lead, ...archive] = numbered;

  return (
    <>
      <InsightsMasthead count={insights.length} />
      {lead && <InsightsLead insight={lead.insight} issue={lead.issue} />}
      {archive.length > 0 && <InsightsArchive entries={archive} />}
      <InsightsReply />
    </>
  );
}
