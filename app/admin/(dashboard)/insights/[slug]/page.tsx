import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findInsight } from "@/lib/repositories/insights";
import { InsightForm } from "@/components/admin/forms/InsightForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SavedToast } from "@/components/admin/SavedToast";
import { deleteInsightAction } from "../actions";

export const metadata: Metadata = { title: "Edit insight", robots: { index: false } };

export default async function EditInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const [insight, { saved }] = await Promise.all([findInsight(slug), searchParams]);
  if (!insight) notFound();

  return (
    <div>
      <SavedToast saved={saved === "1"} />
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
