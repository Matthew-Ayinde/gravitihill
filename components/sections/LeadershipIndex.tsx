import Image from "next/image";
import skyline from "@/public/images/practice-business-advisory.jpg";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { LeaderRow } from "@/components/sections/LeaderRow";
import { initials } from "@/components/ui/PersonCard";
import { CUMULATIVE_YEARS } from "@/content/team";
import type { Person } from "@/lib/schemas";
import { cn, indexNumber } from "@/lib/utils";

/**
 * /about §04 — leadership.
 *
 * Three beats, one section:
 *   1. The claim — headline left, supporting copy and figures right.
 *   2. The records — split rows that alternate sides. At rest the frame holds
 *      only an outlined numeral; the portrait wipes in on hover (on scroll,
 *      on touch) from the edge nearest the text.
 *   3. A closing line, set against Victoria Island.
 *
 * Photography is optional on every record. Without a `photo`, each portrait
 * slot renders a --ridge plate carrying the leader's initials, and every
 * interaction still has something to reveal — the section is complete with
 * zero headshots.
 *
 * Server component. <LeaderRow> is the only client island it adds; all the
 * hover work is CSS (LEADERSHIP INDEX in globals.css).
 */
export function LeadershipIndex({ team }: { team: Person[] }) {
  return (
    <section
      aria-labelledby="leadership-heading"
      className="bg-studio-warm text-ink"
    >
      {/* ── 1. The claim ─────────────────────────────────────────────────── */}
      <div className="shell grid-12 gap-y-10 pt-section pb-16 lg:items-end lg:pb-24">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="type-eyebrow flex items-center gap-4 text-ink-muted">
              <span className="text-green">04</span>
              <span aria-hidden="true" className="h-px w-6 bg-rule" />
              <span className="whitespace-nowrap">Leadership</span>
            </p>
          </Reveal>

          <HeadlineReveal
            as="h2"
            id="leadership-heading"
            className="type-display mt-10 text-h2 text-ink-display sm:text-h1"
            lines={[
              "Fifty-five years",
              "of it. None of it",
              <span key="last" className="accent-word">
                theoretical.
              </span>,
            ]}
          />
        </div>

        {/* Supporting copy and figures sit opposite the headline, aligned to
            its last line, so the claim fills the width without centring. */}
        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <Reveal delay={0.1}>
            <p className="type-eyebrow text-green">
              Experience that compounds.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="measure-tight mt-6 text-ink-muted">
              The people who lead the work have run agencies, consultancies and
              group strategy functions. Nothing we advise is being tried for
              the first time on your business.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <dl className="mt-10 flex gap-12 border-t border-rule pt-6">
              <div className="flex flex-col-reverse gap-2">
                <dt className="type-eyebrow text-ink-muted">
                  Years, cumulative
                </dt>
                <dd className="type-display text-h2 leading-none text-green">
                  {CUMULATIVE_YEARS}
                </dd>
              </div>
              <div className="flex flex-col-reverse gap-2">
                <dt className="type-eyebrow text-ink-muted">Leaders</dt>
                <dd className="type-display text-h2 leading-none text-ink-display">
                  {indexNumber(team.length - 1)}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>

      {/* ── 2. The records ───────────────────────────────────────────────── */}
      <ol className="border-b border-rule">
        {team.map((person, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const [, ...moreBio] = person.bio;
          const hasDetails =
            moreBio.length > 0 ||
            person.credentials.length > 0 ||
            Boolean(person.linkedin);

          return (
            <li key={person.slug}>
              <LeaderRow
                id={person.slug}
                side={side}
                media={<RowMedia person={person} index={i} side={side} />}
                summary={<RowSummary person={person} />}
                details={
                  hasDetails ? (
                    <RowDetails person={person} moreBio={moreBio} />
                  ) : undefined
                }
              />
            </li>
          );
        })}
      </ol>

      {/* ── 3. The close ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <Image
          src={skyline}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-top grayscale"
        />
        {/* Legibility scrim: near-solid under the type on the left, thinning
            to let the skyline through on the right. Solid on narrow screens,
            where the statement spans the full width. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-studio-warm/85 lg:bg-transparent lg:bg-linear-to-r lg:from-studio-warm lg:via-studio-warm/80 lg:to-studio-warm/5"
        />

        <div className="shell grid-12 relative gap-y-10 py-section">
          <div className="col-span-12 border-l border-green pl-6 lg:col-span-7 lg:pl-12">
            <Reveal>
              <p className="type-eyebrow text-ink-muted">Our leadership</p>
            </Reveal>
            <HeadlineReveal
              as="p"
              className="type-display mt-6 text-h2 text-ink-display sm:text-h1"
              lines={[
                "Experience is not",
                "what we know.",
                "It’s what we know",
                <span key="last" className="accent-word">
                  how to do.
                </span>,
              ]}
            />
          </div>

          <div className="col-span-12 lg:col-span-3 lg:col-start-10">
            <Reveal delay={0.15}>
              <p className="type-eyebrow space-y-2 text-ink">
                <span className="block">People.</span>
                <span className="block">Perspective.</span>
                <span className="block">Lasting impact.</span>
              </p>
              <span
                aria-hidden="true"
                className="mt-6 block h-px w-16 bg-ink-muted"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Splits a name across two display lines, the heavier half first. */
function nameLines(name: string): string[] {
  const words = name.split(" ");
  if (words.length < 2) return [name];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

/**
 * A portrait filling its frame — the photograph when there is one, otherwise
 * a --ridge plate with the leader's initials.
 */
function Portrait({
  person,
  alt,
  sizes,
  className,
}: {
  person: Person;
  alt: string;
  sizes: string;
  className?: string;
}) {
  const photo = person.photo;

  return (
    <div
      data-photo={photo ? "" : undefined}
      className={cn("absolute inset-0", className)}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover object-top"
          {...(photo.blurDataURL
            ? { placeholder: "blur" as const, blurDataURL: photo.blurDataURL }
            : {})}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-ridge"
        >
          <span className="type-display text-h1 leading-none text-white/90">
            {initials(person.name)}
          </span>
        </span>
      )}
    </div>
  );
}

function RowMedia({
  person,
  index,
  side,
}: {
  person: Person;
  index: number;
  side: "left" | "right";
}) {
  return (
    <>
      {/* At rest: an empty frame and a numeral. */}
      <div aria-hidden="true" className="absolute inset-0 bg-studio-warm-deep" />

      {/* The portrait, clipped shut until the row asks for it. */}
      <div className="lead-portrait absolute inset-0 overflow-hidden">
        <Portrait
          person={person}
          alt={person.photo?.alt ?? ""}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="lead-portrait-img"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ridge/14" />
      </div>

      {/* Marks the edge the portrait opens from. */}
      <span
        aria-hidden="true"
        className={cn(
          "lead-edge absolute inset-y-0 w-px bg-accent",
          side === "left" ? "right-0" : "left-0",
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-6 lg:bottom-10",
          side === "left" ? "left-6 lg:left-10" : "right-6 lg:right-10",
        )}
      >
        <Parallax range={0.12} direction="up">
          <span className="lead-numeral type-display block text-numeral">
            {indexNumber(index)}
          </span>
        </Parallax>
      </div>
    </>
  );
}

function RowSummary({ person }: { person: Person }) {
  const credential = person.credentials[0];

  return (
    <>
      {/* Role and headline credential share the top line, so the name below
          gets the full width of the panel — a hyphenated surname squeezed
          beside a credential breaks at its hyphen. */}
      <Reveal className="flex items-baseline justify-between gap-8">
        <p className="type-eyebrow text-ink-muted">{person.role}</p>
        {credential && (
          <p className="type-eyebrow hidden max-w-64 text-right text-ink-muted sm:block">
            {credential}
          </p>
        )}
      </Reveal>

      <HeadlineReveal
        as="h3"
        className="lead-name type-display mt-5 text-h1 text-ink-display"
        lines={nameLines(person.name)}
      />

      <Reveal delay={0.1}>
        <p className="measure-tight mt-7 text-ink-muted">{person.bio[0]}</p>
      </Reveal>
    </>
  );
}

function RowDetails({
  person,
  moreBio,
}: {
  person: Person;
  moreBio: string[];
}) {
  return (
    <div className="pt-8">
      {moreBio.length > 0 && (
        <div className="space-y-4">
          {moreBio.map((paragraph, i) => (
            <p key={i} className="measure-tight text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {person.credentials.length > 0 && (
        <ul className="mt-8 max-w-md border-b border-rule">
          {person.credentials.map((credential) => (
            <li
              key={credential}
              className="type-eyebrow border-t border-rule py-3 text-ink-muted"
            >
              {credential}
            </li>
          ))}
        </ul>
      )}

      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw type-eyebrow mt-6 text-green"
        >
          LinkedIn ↗
        </a>
      )}
    </div>
  );
}
