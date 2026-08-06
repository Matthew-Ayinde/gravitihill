import type { Metadata } from "next";
import { InsightForm } from "@/components/admin/forms/InsightForm";

export const metadata: Metadata = { title: "New insight", robots: { index: false } };

export default function NewInsightPage() {
  return (
    <div>
      <p className="type-eyebrow text-green">Insights</p>
      <h1 className="type-display mt-3 text-h1">New article.</h1>
      <div className="mt-12">
        <InsightForm />
      </div>
    </div>
  );
}
