import Link from "next/link";
import type { Metadata } from "next";
import { listInsights } from "@/lib/repositories/insights";
import { editorialDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Insights", robots: { index: false } };

export default async function AdminInsightsPage() {
  const insights = await listInsights();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Insights</h1>
        </div>
        <Link href="/admin/insights/new" className="link-draw type-eyebrow">
          + New article
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {insights.map((insight) => (
          <li key={insight.slug} className="border-b border-rule py-6">
            <Link href={`/admin/insights/${insight.slug}`} className="flex items-baseline justify-between gap-6 hover:opacity-70">
              <span>
                <span className="type-subhead block text-h3">{insight.title}</span>
                <span className="mt-1 block text-caption text-ink-muted">
                  {insight.category} · {editorialDate(insight.publishedAt)}
                  {insight.placeholderBody ? " · placeholder body" : ""}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {insights.length === 0 && (
          <li className="py-10 text-body-lg text-ink-muted">No articles yet.</li>
        )}
      </ul>
    </div>
  );
}
