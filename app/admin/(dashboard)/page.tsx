import Link from "next/link";
import type { Metadata } from "next";
import { listPractices } from "@/lib/repositories/practices";
import { listSectors } from "@/lib/repositories/sectors";
import { listInsights } from "@/lib/repositories/insights";
import { listTeam } from "@/lib/repositories/team";
import { listSocialPosts } from "@/lib/repositories/social";
import { listMedia } from "@/lib/repositories/media";
import { listSubmissions, countNewSubmissions } from "@/lib/repositories/contact-submissions";
import { editorialDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false } };

const CARDS: { label: string; href: string; count: (n: {
  practices: number; sectors: number; insights: number; team: number; social: number; media: number;
}) => number }[] = [
  { label: "Practices", href: "/admin/services", count: (n) => n.practices },
  { label: "Sectors", href: "/admin/sectors", count: (n) => n.sectors },
  { label: "Insights", href: "/admin/insights", count: (n) => n.insights },
  { label: "Leadership", href: "/admin/team", count: (n) => n.team },
  { label: "Social posts", href: "/admin/social", count: (n) => n.social },
  { label: "Media assets", href: "/admin/media", count: (n) => n.media },
];

export default async function AdminOverviewPage() {
  const [practices, sectors, insights, team, social, media, submissions, newCount] =
    await Promise.all([
      listPractices(),
      listSectors(),
      listInsights(),
      listTeam(),
      listSocialPosts(),
      listMedia(),
      listSubmissions(),
      countNewSubmissions(),
    ]);

  const counts = {
    practices: practices.length,
    sectors: sectors.length,
    insights: insights.length,
    team: team.length,
    social: social.length,
    media: media.length,
  };

  return (
    <div>
      <p className="type-eyebrow text-green">Overview</p>
      <h1 className="type-display mt-3 text-h1">Content, at a glance.</h1>

      <div className="mt-12 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-canvas p-6 transition-colors duration-200 hover:bg-canvas-alt"
          >
            <p className="type-display text-h1">{card.count(counts)}</p>
            <p className="type-eyebrow mt-2 text-ink-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-16 border-t border-rule pt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="type-subhead text-h3">Recent enquiries</h2>
          <Link href="/admin/enquiries" className="link-draw type-eyebrow text-ink-muted">
            {newCount > 0 ? `${newCount} new` : "All enquiries"}
          </Link>
        </div>

        {submissions.length === 0 ? (
          <p className="mt-6 text-body-lg text-ink-muted">No enquiries yet.</p>
        ) : (
          <ul className="mt-6 border-t border-rule">
            {submissions.slice(0, 5).map((s) => (
              <li key={s.id} className="border-b border-rule py-4">
                <Link href="/admin/enquiries" className="flex items-baseline justify-between gap-6">
                  <span>
                    <span className="type-subhead block text-body-lg">
                      {s.name} — {s.company}
                    </span>
                    <span className="text-caption text-ink-muted">{s.enquiryType}</span>
                  </span>
                  <span className="type-eyebrow shrink-0 text-ink-muted">
                    {editorialDate(s.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
