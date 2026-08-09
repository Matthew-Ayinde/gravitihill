import Link from "next/link";
import type { Metadata } from "next";
import { listDnaPillarsWithSlug } from "@/lib/repositories/dna";
import { SavedToast } from "@/components/admin/SavedToast";

export const metadata: Metadata = { title: "Brand DNA", robots: { index: false } };

export default async function AdminDnaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [pillars, { saved }] = await Promise.all([listDnaPillarsWithSlug(), searchParams]);

  return (
    <div>
      <SavedToast saved={saved === "1"} />
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Brand DNA</h1>
          <p className="mt-3 max-w-md text-caption text-ink-muted">
            The four pillars render as a fixed 2×2 grid — keep this at four
            unless the layout is revisited too.
          </p>
        </div>
        <Link href="/admin/dna/new" className="link-draw type-eyebrow">
          + New pillar
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {pillars.map((pillar, i) => (
          <li key={pillar.slug} className="border-b border-rule py-6">
            <Link href={`/admin/dna/${pillar.slug}`} className="flex items-baseline gap-6 hover:opacity-70">
              <span className="type-eyebrow text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="type-subhead block text-h3">{pillar.name}</span>
                <span className="mt-1 block text-caption text-ink-muted">{pillar.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
