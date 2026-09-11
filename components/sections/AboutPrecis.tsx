import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PrecisMotion } from "@/components/motion/PrecisMotion";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import type { About } from "@/lib/schemas";
import { indexNumber } from "@/lib/utils";

/** Slats per photograph. Odd, so the middle slat sits on the image's centre. */
const SLATS = 7;

/**
 * Home §01, "Who we are": an editorial spread.
 *
 * The positioning line runs at display-xl across the head of the section,
 * then the spread splits into two planes: a figure on the left, and the lede
 * and the founding quote on the right, set lower so the columns overlap
 * rather than align.
 *
 * Deliberately not here: the founding year, the base and the 55+ years. The
 * hero's facts column carries all three one screen above, so this section
 * spends its space on the argument instead: the précis, and the origin in one
 * sentence.
 *
 * ── The figure ───────────────────────────────────────────────────────────
 * Every curated photograph in `about.heroImages` is rendered as a frame of
 * seven horizontal slats, each slat a clip of the same image (the same URL,
 * so one download per photograph). Only the first slat of each frame carries
 * the alt text. The slats are what <PrecisMotion> moves: they assemble on
 * approach, and weave in over each other when the reader steps between
 * photographs. With one photograph there is no stepper; with none, the
 * figure is EditorialImage's typographic plate and nothing moves.
 *
 * ── Content-driven emphasis ──────────────────────────────────────────────
 * The headline breaks after "of" when the positioning line has one, and the
 * quote's underline sits on its last two words. Both come from the content
 * module, so an edit in the admin keeps the composition.
 *
 * Everything renders on the server; the client layer only finds elements by
 * data attribute.
 */
export function AboutPrecis({ about }: { about: About }) {
  const images = about.heroImages;
  const [lead, turn] = splitPositioning(about.positioning);
  const [quoteHead, quoteTail] = splitTail(about.pullQuote, 2);
  const originHeading = about.origin[0]?.heading;

  return (
    <Section tone="alt" labelledBy="precis-heading" className="overflow-x-clip">
      <PrecisMotion>
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-3">
            <SectionLabel index="01">Who we are</SectionLabel>
            <SectionLabelInline index="01">Who we are</SectionLabelInline>
          </div>

          <h2
            id="precis-heading"
            data-precis-heading
            className="type-display col-span-12 text-display-xl lg:col-span-9"
          >
            {lead ? (
              <span data-precis-track className="block">
                {lead}
              </span>
            ) : null}
            <span data-precis-weight className="block text-green">
              {turn}
            </span>
          </h2>
        </div>

        <div className="shell grid-12 mt-16 items-start gap-y-16 lg:mt-24">
          {/* ── The figure ────────────────────────────────────────────── */}
          <figure data-precis-figure data-motion className="col-span-12 lg:col-span-5">
            {images.length > 0 ? (
              <div
                data-precis-stage
                className="relative aspect-4/5 w-full touch-pan-y overflow-hidden bg-canvas"
              >
                {images.map((image, f) => (
                  <div
                    key={`${image.src}-${f}`}
                    data-slat-frame
                    data-active={f === 0 ? "" : undefined}
                    aria-hidden={f === 0 ? undefined : true}
                    className="slat-frame"
                  >
                    {Array.from({ length: SLATS }, (_, s) => (
                      <div
                        key={s}
                        data-slat
                        data-motion
                        aria-hidden={s === 0 ? undefined : true}
                        className="slat"
                        style={{ "--s": s, "--n": SLATS } as CSSProperties}
                      >
                        <div data-slat-media data-motion className="absolute inset-0">
                          <Image
                            src={image.src}
                            alt={s === 0 ? image.alt : ""}
                            fill
                            sizes="(min-width: 1024px) 38vw, 100vw"
                            className="object-cover"
                            {...(image.blurDataURL
                              ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                              : {})}
                          />
                        </div>
                      </div>
                    ))}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ridge/10" />
                  </div>
                ))}
              </div>
            ) : (
              <EditorialImage caption="Lagos, Nigeria." ratio="4:5" className="w-full" />
            )}

            <figcaption className="mt-4 flex items-center justify-between gap-6 border-t border-rule pt-4">
              <span className="type-eyebrow text-ink-muted">Lagos, Nigeria.</span>

              {images.length > 1 ? (
                <span className="flex items-center gap-3">
                  <button type="button" data-slat-prev aria-label="Previous photograph" className="precis-step">
                    <span aria-hidden="true">←</span>
                  </button>
                  <span aria-hidden="true" className="type-eyebrow w-16 text-center tabular-nums text-ink-muted">
                    <span data-slat-index className="text-green">
                      {indexNumber(0)}
                    </span>{" "}
                    / {indexNumber(images.length - 1)}
                  </span>
                  <span data-slat-live aria-live="polite" className="sr-only" />
                  <button type="button" data-slat-next aria-label="Next photograph" className="precis-step">
                    <span aria-hidden="true">→</span>
                  </button>
                </span>
              ) : null}
            </figcaption>
          </figure>

          {/* ── The copy ──────────────────────────────────────────────── */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-32">
            <p data-precis-rise data-motion className="type-subhead max-w-[34ch] text-h3 text-ink">
              {about.precis}
            </p>

            <div className="mt-16 lg:mt-24">
              <span data-precis-rule data-motion aria-hidden="true" className="block h-px w-full origin-left bg-rule" />
              {originHeading ? (
                <p data-precis-rise data-motion className="type-eyebrow mt-5 text-ink-muted">
                  {originHeading}
                </p>
              ) : null}
              <blockquote data-precis-rise data-motion className="mt-6">
                <p className="type-display max-w-[22ch] text-h2">
                  {quoteHead}
                  <span data-precis-underline className="precis-underline">
                    {quoteTail}
                  </span>
                </p>
              </blockquote>
            </div>

            <div data-precis-rise data-motion className="mt-14">
              <Link href="/about" className="precis-cta type-eyebrow">
                <span className="link-draw">Read the full story</span>
                <span aria-hidden="true" className="precis-cta-arrow">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </PrecisMotion>
    </Section>
  );
}

/** "Re-definers of Brand Building" → ["Re-definers of", "Brand Building."] */
function splitPositioning(text: string): [string, string] {
  const clean = text.trim().replace(/\.$/, "");
  const at = clean.indexOf(" of ");
  if (at < 0) return ["", `${clean}.`];
  return [clean.slice(0, at + 3), `${clean.slice(at + 4)}.`];
}

/** Splits off the last `words` words, keeping the space with the head. */
function splitTail(text: string, words: number): [string, string] {
  const tokens = text.trim().split(/\s+/);
  if (tokens.length <= words) return ["", tokens.join(" ")];
  return [`${tokens.slice(0, -words).join(" ")} `, tokens.slice(-words).join(" ")];
}
