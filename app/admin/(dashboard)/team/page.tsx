import Link from "next/link";
import type { Metadata } from "next";
import { listTeam } from "@/lib/repositories/team";

export const metadata: Metadata = { title: "Team", robots: { index: false } };

export default async function AdminTeamPage() {
  const team = await listTeam();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Leadership</h1>
        </div>
        <Link href="/admin/team/new" className="link-draw type-eyebrow">
          + New leader
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {team.map((person) => (
          <li key={person.slug} className="border-b border-rule py-6">
            <Link href={`/admin/team/${person.slug}`} className="flex items-baseline justify-between gap-6 hover:opacity-70">
              <span>
                <span className="type-subhead block text-h3">{person.name}</span>
                <span className="mt-1 block text-caption text-ink-muted">{person.role}</span>
              </span>
            </Link>
          </li>
        ))}
        {team.length === 0 && (
          <li className="py-10 text-body-lg text-ink-muted">No leaders yet.</li>
        )}
      </ul>
    </div>
  );
}
