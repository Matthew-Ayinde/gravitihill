import Image from "next/image";
import { Studio } from "@/components/sections/Studio";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import type { Img } from "@/lib/schemas";

/**
 * /about §02 — the argument, and the object it stands next to.
 *
 * The statement breaks colour mid-line: "It is" stays in ink while "short of
 * the discipline" turns green, so the sentence changes tone exactly where it
 * turns from diagnosis to the thing being sold — at the hinge of the
 * sentence, not at a line ending.
 */
export function AboutBigPicture({ figure }: { figure?: Img }) {
  return (
    <Studio labelledBy="about-bigger-picture">
      <div className="shell">
        <Reveal>
          <p className="type-eyebrow flex items-center gap-4 text-ink-muted">
            <span className="text-green">02</span>
            <span aria-hidden="true" className="h-px w-6 bg-rule" />
            <span className="whitespace-nowrap">The bigger picture</span>
          </p>
        </Reveal>

        <div className="mt-12 grid-12 items-start gap-y-16">
          <div className="col-span-12 lg:col-span-6">
            <HeadlineReveal
              as="h2"
              id="about-bigger-picture"
              className="type-display text-h2 text-ink-display"
              lines={[
                "Nigerian business",
                "is not short of ideas.",
                <>
                  It is <span className="text-green">short of the discipline</span>
                </>,
                <span key="turns" className="text-green">
                  that turns one into a
                </span>,
                <span key="outcome" className="text-green">
                  measurable outcome.
                </span>,
              ]}
            />
          </div>

          {/* The object. Drifts against the type as the section scrolls —
              two things at different depths moving at different rates is
              the whole of what makes a flat page read as a room. */}
          <div className="col-span-12 lg:col-span-3">
            <StudioObject figure={figure} />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <Reveal>
              <p className="type-eyebrow text-ink-muted">
                The gap we were built to close
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="measure-tight mt-6 text-ink-muted">
                Graviti Hill was founded on a specific frustration. Nigerian
                business is not short of ideas. It is short of the discipline
                that turns an idea into a measurable outcome, and the gap
                between the two had become the most expensive thing in the
                room.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="measure-tight mt-5 text-ink-muted">
                Creative thinking and commercial impact were being run as
                separate conversations by separate people, usually in separate
                buildings. The strategy deck said one thing, the operating
                model permitted another, and the brand promised a third.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Studio>
  );
}

/**
 * The sculptural object standing on the studio floor.
 *
 * The reference's object is a photoreal render, which CSS cannot produce and
 * this build cannot generate. Rather than ship a weak imitation of the
 * strongest thing in the frame, this is a slot: hand it a real render through
 * `about.figure` and the section is the reference; leave it empty and it
 * falls back to a form built from the same CSS 3D as the rest of the room.
 *
 * Same discipline as <PersonCard>'s monogram — the page is complete and
 * composed with no photography present, and improves the moment there is
 * some, with no layout change either way.
 */
function StudioObject({ figure }: { figure?: Img }) {
  return (
    <Parallax range={0.1} direction="up" className="block">
      <figure className="relative">
        <div className="perspective-scene relative aspect-4/5 w-full">
          {figure ? (
            <Image
              src={figure.src}
              alt={figure.alt}
              fill
              sizes="(min-width: 1024px) 28vw, 80vw"
              className="object-contain"
              {...(figure.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: figure.blurDataURL }
                : {})}
            />
          ) : (
            <MonolithFallback />
          )}
        </div>
        {/* Whatever stands here, it stands on the same floor as the type. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[8%] -bottom-2 block h-8 rounded-[50%] bg-ridge/18 blur-2xl"
        />
      </figure>
    </Parallax>
  );
}

/**
 * Three stacked slabs, offset and turned — a form with a silhouette rather
 * than a rectangle.
 *
 * The first version of this was one slab and read as exactly what it was: a
 * green box. A form only reads as an object when its outline is irregular
 * enough that the eye has to resolve it, so this is three masses at
 * different depths and widths, each with a lit face and a shaded return, the
 * middle one turned against the other two.
 *
 * It is a stand-in, and it is meant to look like a considered stand-in
 * rather than an attempt to pass for the render it is holding a place for.
 */
function MonolithFallback() {
  return (
    <div
      aria-hidden="true"
      className="preserve-3d absolute inset-0 transform-[rotateY(-16deg)]"
    >
      {/* Rear mass — furthest back, most in shadow. */}
      <div className="preserve-3d absolute bottom-0 left-[6%] top-[6%] w-[38%] transform-[translateZ(-70px)]">
        <div className="absolute inset-0 bg-ridge" />
      </div>

      {/* Centre mass, turned against the others. */}
      <div className="preserve-3d absolute bottom-0 left-[26%] top-[24%] w-[42%] transform-[translateZ(-18px)_rotateY(14deg)]">
        <div className="absolute inset-0 bg-green" />
        <div className="absolute inset-y-0 -left-8 w-8 origin-right bg-ridge transform-[rotateY(-64deg)]" />
      </div>

      {/* Front mass — catches the key light. */}
      <div className="preserve-3d absolute bottom-0 left-[58%] top-[44%] w-[30%] transform-[translateZ(46px)]">
        <div className="absolute inset-0 bg-accent/85" />
        <div className="absolute inset-y-0 -left-6 w-6 origin-right bg-green transform-[rotateY(-62deg)]" />
      </div>
    </div>
  );
}
