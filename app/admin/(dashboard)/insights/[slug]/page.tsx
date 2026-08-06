import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findInsight } from "@/lib/repositories/insights";
import { InsightForm } from "@/components/admin/forms/InsightForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteInsightAction } from "../actions";

export const metadata: Metadata = { title: "Edit insight", robots: { index: false } };

export default async function EditInsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await findInsight(slug);
  if (!insight) notFound();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Insights</p>
          <h1 className="type-display mt-3 text-h1">{insight.title}</h1>
        </div>
        <DeleteButton
          action={deleteInsightAction.bind(null, insight.slug)}
          confirmMessage={`Delete "${insight.title}"? This can't be undone.`}
        />
      </div>

      <div className="mt-12">
        <InsightForm insight={insight} />
      </div>
    </div>
  );
}
