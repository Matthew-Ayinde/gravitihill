import Link from "next/link";
import type { Metadata } from "next";
import { listSectors } from "@/lib/repositories/sectors";

export const metadata: Metadata = { title: "Sectors", robots: { index: false } };

export default async function AdminSectorsPage() {
  const sectors = await listSectors();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Sectors</h1>
          <p className="mt-3 max-w-md text-caption text-ink-muted">
            Order matters — it drives the Consumer → B2B → Technology sequence
            in the signature pinned panel on the home page.
          </p>
        </div>
        <Link href="/admin/sectors/new" className="link-draw type-eyebrow">
          + New sector
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {sectors.map((sector, i) => (
          <li key={sector.slug} className="border-b border-rule py-6">
            <Link href={`/admin/sectors/${sector.slug}`} className="flex items-baseline gap-6 hover:opacity-70">
              <span className="type-eyebrow text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="type-subhead block text-h3">{sector.name}</span>
                <span className="measure mt-1 block text-caption text-ink-muted">
                  {sector.proposition}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
