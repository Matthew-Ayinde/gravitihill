import type { Metadata } from "next";
import { listSubmissions } from "@/lib/repositories/contact-submissions";
import { editorialDate } from "@/lib/utils";
import { setStatusAction } from "./actions";

export const metadata: Metadata = { title: "Enquiries", robots: { index: false } };

const STATUS_LABEL: Record<string, string> = { new: "New", read: "Read", archived: "Archived" };

export default async function AdminEnquiriesPage() {
  const submissions = await listSubmissions();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">Enquiries.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        Every /contact submission lands here, whether or not the email
        notification sent successfully.
      </p>

      <ul className="mt-12 border-t border-rule">
        {submissions.map((s) => (
          <li key={s.id} className="border-b border-rule">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6">
                <span>
                  <span
                    className={`type-eyebrow mr-3 ${s.status === "new" ? "text-green" : "text-ink-muted"}`}
                  >
                    {STATUS_LABEL[s.status]}
                  </span>
                  <span className="type-subhead text-body-lg">
                    {s.name} — {s.company}
                  </span>
                  <span className="ml-3 text-caption text-ink-muted">{s.enquiryType}</span>
                </span>
                <span className="type-eyebrow shrink-0 text-ink-muted">{editorialDate(s.createdAt)}</span>
              </summary>

              <div className="measure space-y-4 pb-8">
                <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-caption text-ink-muted sm:grid-cols-4">
                  <div>
                    <dt className="text-ink-muted/60">Role</dt>
                    <dd className="text-ink">{s.role}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted/60">Email</dt>
                    <dd className="text-ink">{s.email}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted/60">Phone</dt>
                    <dd className="text-ink">{s.phone || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted/60">Budget</dt>
                    <dd className="text-ink">{s.budget || "—"}</dd>
                  </div>
                </dl>

                <p className="whitespace-pre-wrap text-body-lg">{s.message}</p>

                <div className="flex gap-3 pt-2">
                  <form action={setStatusAction.bind(null, s.id, "read")}>
                    <button type="submit" className="type-eyebrow border border-rule px-3 py-1.5 text-ink-muted hover:bg-canvas-alt">
                      Mark read
                    </button>
                  </form>
                  <form action={setStatusAction.bind(null, s.id, "archived")}>
                    <button type="submit" className="type-eyebrow border border-rule px-3 py-1.5 text-ink-muted hover:bg-canvas-alt">
                      Archive
                    </button>
                  </form>
                </div>
              </div>
            </details>
          </li>
        ))}
        {submissions.length === 0 && (
          <li className="py-10 text-body-lg text-ink-muted">No enquiries yet.</li>
        )}
      </ul>
    </div>
  );
}
