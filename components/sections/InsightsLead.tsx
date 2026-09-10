import Image from "next/image";
import Link from "next/link";
import { LeadAperture } from "@/components/sections/LeadAperture";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import type { Insight } from "@/lib/schemas";
import { editorialDate, indexNumber } from "@/lib/utils";

/**
 * /insights — the lead.
 *
 * The newest piece, alone, at the size of the screen. On desktop the stage
 * holds while its photograph opens from a small aperture to full bleed and
 * the title rises over it (<LeadAperture>). This is the only place the lead
 * appears on the route — the archive below starts at the second piece.
 *
 * Layer order, back to front: photograph (or a numeral plate), the site's
 * --ridge grade, a legibility scrim under the copy, then the copy. The title
 * link is stretched across the stage so the whole panel opens the piece,
 * while the link's accessible name stays the title alone.
 */
export function InsightsLead({ insight, issue }: { insight: Insight; issue: number }) {
  const image = insight.coverImage;

  return (
    <LeadAperture labelledBy="lead-heading" className="lead-track bg-canvas">
      <div
        data-aperture-stage
        className="relative h-[88svh] min-h-136 overflow-hidden text-white lg:sticky lg:top-0 lg:h-svh"
      >
        <div data-aperture-frame data-motion className="absolute inset-0 overflow-hidden bg-abyss">
          <div data-aperture-media data-motion className="absolute -inset-[4%]">
            {image ? (
              image.video ? (
                <AmbientVideo
                  image={{ ...image, video: image.video }}
                  sizes="100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  {...(image.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                    : {})}
                />
              )
            ) : (
              <span
                aria-hidden="true"
                className="type-display absolute inset-0 flex items-center justify-center text-numeral text-white/6"
              >
                {indexNumber(issue - 1)}
              </span>
            )}
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ridge/10" />
          {/* Legibility only — it exists for the copy, so on desktop it
              arrives with the copy as the aperture opens. */}
          <div
            data-aperture-scrim
            data-motion
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-abyss/95 via-abyss/50 to-transparent lg:h-4/5"
          />
        </div>

        <div className="shell relative flex h-full flex-col justify-end pt-28 pb-10 lg:pb-16">
          <div className="grid-12 items-end gap-y-8">
            <div className="col-span-12 lg:col-span-8">
              <p
                data-lead-meta
                data-motion
                className="type-eyebrow flex flex-wrap items-center gap-x-5 gap-y-2 text-white/65"
              >
                <span className="text-gold">The lead</span>
                <span className="tabular-nums">No. {indexNumber(issue - 1)}</span>
                <span>{insight.category}</span>
                <time dateTime={insight.publishedAt} className="tabular-nums">
                  {editorialDate(insight.publishedAt)}
                </time>
                <span className="tabular-nums">{insight.readingTime} min read</span>
              </p>

              <h2 id="lead-heading" className="type-display mt-6 max-w-[20ch] text-h1 2xl:text-hero">
                <Link
                  href={`/insights/${insight.slug}`}
                  className="lead-link after:absolute after:inset-0 after:content-['']"
                >
                  <span data-lead-title data-motion className="block">
                    {insight.title}
                  </span>
                </Link>
              </h2>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <p data-lead-fade data-motion className="measure-tight text-body-lg text-white/75">
                {insight.excerpt}
              </p>
              <p
                data-lead-fade
                data-motion
                aria-hidden="true"
                className="type-eyebrow mt-8 flex items-center gap-4 text-white"
              >
                Read the piece
                <span className="lead-cue block h-px w-12 bg-accent" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </LeadAperture>
  );
}
