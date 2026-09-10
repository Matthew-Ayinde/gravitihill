import Image from "next/image";
import Link from "next/link";
import { ArchiveStack, type ArchiveEntry } from "@/components/sections/ArchiveStack";
import type { Insight } from "@/lib/schemas";
import { editorialDate, indexNumber } from "@/lib/utils";

/**
 * /insights — the archive: every piece after the lead, as a stack of files.
 *
 * The cards are rendered here, on the server, and handed to <ArchiveStack> as
 * elements plus a category string — the client component never receives the
 * content module, so filtering ships no article data to the browser.
 *
 * Numbering is by issue, not by position: the newest piece carries the highest
 * number, like a publication, so a card keeps its number however the archive
 * is filtered.
 */
export function InsightsArchive({
  entries,
}: {
  entries: ReadonlyArray<{ insight: Insight; issue: number }>;
}) {
  const stack: ArchiveEntry[] = entries.map(({ insight, issue }) => ({
    id: insight.slug,
    category: insight.category,
    file: <ArchiveFile insight={insight} issue={issue} />,
  }));

  return (
    <section aria-labelledby="archive-heading" className="bg-canvas-alt py-section">
      <div className="shell">
        <ArchiveStack
          entries={stack}
          heading={
            <h2 id="archive-heading" className="type-display shrink-0 text-h1 text-ink-display">
              Filed earlier.
            </h2>
          }
        />
      </div>
    </section>
  );
}

/**
 * One file. Photograph right on desktop, on top on phones.
 *
 * `data-file-body` is what recedes as the next file slides over it, and
 * `data-file-dim` is the shade it recedes into; `data-pan` is the photograph
 * layer the cursor leans. The title link is stretched over the card.
 */
function ArchiveFile({ insight, issue }: { insight: Insight; issue: number }) {
  const image = insight.coverImage;

  return (
    <article
      data-file-body
      data-motion
      className="file-card group relative flex flex-col overflow-hidden rounded-sm bg-canvas ring-1 ring-rule lg:grid lg:grid-cols-12"
    >
      <div className="relative aspect-3/2 overflow-hidden bg-ridge lg:order-last lg:col-span-5 lg:aspect-auto">
        <div data-pan data-motion className="file-media absolute inset-0 scale-108">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
              {...(image.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                : {})}
            />
          ) : (
            <span
              aria-hidden="true"
              className="type-display flex h-full items-center justify-center text-numeral text-white/8"
            >
              {indexNumber(issue - 1)}
            </span>
          )}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-ridge/10" />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:col-span-7 lg:p-10 xl:p-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-rule pb-4">
          <p className="type-eyebrow text-green">{insight.category}</p>
          <p className="type-eyebrow tabular-nums text-ink-muted">
            <time dateTime={insight.publishedAt}>{editorialDate(insight.publishedAt)}</time>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            {insight.readingTime} min
          </p>
        </div>

        <div className="mt-8 lg:mt-auto lg:pt-8">
          <p className="type-eyebrow tabular-nums text-ink-muted">No. {indexNumber(issue - 1)}</p>
          <h3 className="type-display mt-3 max-w-[22ch] text-h2 text-ink-display">
            <Link
              href={`/insights/${insight.slug}`}
              className="file-link after:absolute after:inset-0 after:content-['']"
            >
              {insight.title}
            </Link>
          </h3>
          <p className="measure-tight mt-5 text-ink-muted lg:text-body-lg">{insight.excerpt}</p>
        </div>

        <p aria-hidden="true" className="type-eyebrow mt-8 flex items-center gap-4 text-ink lg:mt-10">
          Read
          <span className="file-cue block h-px w-10 bg-green" />
        </p>
      </div>

      <span
        data-file-dim
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink opacity-0"
      />
    </article>
  );
}
