import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">Settings.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        NAP of record — the footer, /contact and the Organization JSON-LD all
        read this, so it stays consistent everywhere for local SEO.
      </p>
      <div className="mt-12">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
