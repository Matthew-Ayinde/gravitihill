import Link from "next/link";
import { Lockup } from "@/components/ui/Lockup";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV: { label: string; href: string }[] = [
  { label: "Overview", href: "/admin" },
  { label: "Services", href: "/admin/services" },
  { label: "Sectors", href: "/admin/sectors" },
  { label: "Insights", href: "/admin/insights" },
  { label: "Team", href: "/admin/team" },
  { label: "Brand DNA", href: "/admin/dna" },
  { label: "The Naked Board", href: "/admin/naked-board" },
  { label: "Social wall", href: "/admin/social" },
  { label: "About", href: "/admin/about" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Media library", href: "/admin/media" },
  { label: "Enquiries", href: "/admin/enquiries" },
];

export function Sidebar({ email }: { email: string }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-rule bg-canvas">
      <div className="border-b border-rule px-6 py-6">
        <Lockup variant="black" width={120} />
        <p className="type-eyebrow mt-3 text-ink-muted">Admin</p>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="type-eyebrow block px-3 py-2.5 text-ink-muted hover:bg-canvas-alt hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-rule px-6 py-5">
        <p className="truncate text-caption text-ink-muted" title={email}>
          {email}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <Link href="/" target="_blank" className="link-draw type-eyebrow text-ink-muted">
            View site ↗
          </Link>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
