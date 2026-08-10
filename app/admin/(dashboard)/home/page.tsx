import type { Metadata } from "next";
import { getHomeHeroMedia } from "@/lib/home-hero";
import { HeroForm } from "@/components/admin/forms/HeroForm";

export const metadata: Metadata = { title: "Home hero", robots: { index: false } };

export default async function AdminHomeHeroPage() {
  const hero = await getHomeHeroMedia();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">Home hero.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        Background for the homepage hero, up to five slides. Optional; leave
        it empty for the original type-only hero. Each slide is a still image
        with an optional ambient video looping over it; two or more slides
        auto-rotate on the public page and fall back to a static first slide
        under reduced motion or a slow connection.
      </p>
      <div className="mt-12">
        <HeroForm hero={hero} />
      </div>
    </div>
  );
}
