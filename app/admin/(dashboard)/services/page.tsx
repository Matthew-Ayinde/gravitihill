import Link from "next/link";
import type { Metadata } from "next";
import { listPractices } from "@/lib/repositories/practices";

export const metadata: Metadata = { title: "Services", robots: { index: false } };

export default async function AdminServicesPage() {
  const practices = await listPractices();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Services</h1>
        </div>
        <Link href="/admin/services/new" className="link-draw type-eyebrow">
          + New practice
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {practices.map((practice) => (
          <li key={practice.slug} className="border-b border-rule py-6">
            <Link href={`/admin/services/${practice.slug}`} className="flex items-baseline justify-between gap-6 hover:opacity-70">
              <span>
                <span className="type-subhead block text-h3">{practice.name}</span>
                <span className="measure mt-1 block text-caption text-ink-muted">
                  {practice.proposition}
                </span>
              </span>
              <span className="type-eyebrow shrink-0 text-ink-muted">
                {practice.offerings.length} services
              </span>
            </Link>
          </li>
        ))}
        {practices.length === 0 && (
          <li className="py-10 text-body-lg text-ink-muted">No practices yet.</li>
        )}
      </ul>
    </div>
  );
}
