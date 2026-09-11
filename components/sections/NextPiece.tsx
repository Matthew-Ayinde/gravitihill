import Image from "next/image";
import Link from "next/link";
import { BloomCard } from "@/components/motion/BloomCard";
import type { Insight } from "@/lib/schemas";
import { editorialDate } from "@/lib/utils";

/**
 * The foot of an article: the one piece to read next.
 *
 * Not a list of related links and not the shared contact panel — one
 * recommendation, given the room to be chosen, with a second offered quietly
 * underneath. Its photograph blooms from the cursor on hover (<BloomCard>).
 * The card's title link is stretched across it; the second piece and the
 * way back to the index are ordinary links.
 */
export function NextPiece({ next, also }: { next: Insight; also?: Insight }) {
  const image = next.coverImage;

  return (
    <section aria-labelledby="next-heading" className="bg-abyss py-section text-white">
      <div className="shell">
        <div className="flex items-baseline justify-between gap-6 border-b border-rule-dark pb-5">
          <h2 id="next-heading" className="type-eyebrow text-accent">
            Up next
          </h2>
          <Link href="/insights" className="link-draw type-eyebrow text-white/60">
            All insights
          </Link>
        </div>

        <BloomCard className="next-card mt-10 flex min-h-120 flex-col justify-end rounded-sm ring-1 ring-rule-dark lg:mt-14 lg:min-h-152">
          {/* A faint monochrome print of the photograph sits under the bloom,
              so the resting card has texture and a hint of what it holds. */}
          {image && (
            <div aria-hidden="true" className="absolute inset-0 -z-20 opacity-15 grayscale">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1440px) 1296px, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {image && (
            <div data-bloom-media aria-hidden="true" className="absolute inset-0 -z-10">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1440px) 1296px, 100vw"
                className="object-cover"
                {...(image.blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                  : {})}
              />
              <div className="absolute inset-0 bg-ridge/20" />
              <div className="absolute inset-0 bg-linear-to-t from-abyss via-abyss/60 to-abyss/20" />
            </div>
          )}

          <div className="grid-12 items-end gap-y-8 p-6 sm:p-10 lg:p-14">
            <div className="col-span-12 lg:col-span-8">
              <p
                data-bloom-rise
                className="type-eyebrow flex flex-wrap gap-x-5 gap-y-2 text-white/60"
              >
                <span>{next.category}</span>
                <time dateTime={next.publishedAt} className="tabular-nums">
                  {editorialDate(next.publishedAt)}
                </time>
                <span className="tabular-nums">{next.readingTime} min read</span>
              </p>
              <h3 data-bloom-rise className="type-display mt-6 max-w-[20ch] text-h1">
                <Link
                  href={`/insights/${next.slug}`}
                  className="next-link after:absolute after:inset-0 after:content-['']"
                >
                  {next.title}
                </Link>
              </h3>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <p data-bloom-rise className="measure-tight text-body-lg text-white/75">
                {next.excerpt}
              </p>
              <p
                data-bloom-rise
                aria-hidden="true"
                className="type-eyebrow mt-8 flex items-center gap-4 text-white"
              >
                Continue reading
                <span className="next-cue block h-px w-12 bg-accent" />
              </p>
            </div>
          </div>
        </BloomCard>

        {also && (
          <p className="mt-10 flex flex-col gap-2 border-t border-rule-dark pt-6 sm:flex-row sm:items-baseline sm:gap-8">
            <span className="type-eyebrow shrink-0 text-white/45">Also filed</span>
            <Link href={`/insights/${also.slug}`} className="type-subhead text-h3 text-white">
              <span className="link-draw">{also.title}</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
