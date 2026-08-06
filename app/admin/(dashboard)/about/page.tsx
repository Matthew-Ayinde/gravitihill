import type { Metadata } from "next";
import { getAbout } from "@/lib/repositories/about";
import { AboutForm } from "@/components/admin/forms/AboutForm";

export const metadata: Metadata = { title: "About", robots: { index: false } };

export default async function AdminAboutPage() {
  const about = await getAbout();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">About.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        One record — powers /about and the précis section on the home page.
      </p>
      <div className="mt-12">
        <AboutForm about={about} />
      </div>
    </div>
  );
}
