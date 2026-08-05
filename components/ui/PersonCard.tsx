import Image from "next/image";
import type { Person } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Placeholder-tolerant leadership portrait.
 *
 * With no `photo` on the record — the current and expected state — this renders
 * a typographic monogram: the person's initials in --green on --canvas-alt, set
 * in the display face at portrait ratio. The layout is complete and composed
 * without a single headshot, which is exactly what the brief requires.
 */

function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function PersonPortrait({
  person,
  className,
  sizes = "(min-width: 1024px) 25vw, 60vw",
  tone = "light",
}: {
  person: Person;
  className?: string;
  sizes?: string;
  tone?: "light" | "dark";
}) {
  if (person.photo) {
    return (
      <div className={cn("relative aspect-4/5 w-full overflow-hidden", className)}>
        <Image
          src={person.photo.src}
          alt={person.photo.alt}
          fill
          sizes={sizes}
          className="object-cover"
          {...(person.photo.blurDataURL
            ? {
                placeholder: "blur" as const,
                blurDataURL: person.photo.blurDataURL,
              }
            : {})}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ridge/8" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-4/5 w-full items-center justify-center",
        tone === "dark" ? "bg-white/6" : "bg-canvas-alt",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "type-display text-h1 leading-none",
          tone === "dark" ? "text-accent" : "text-green",
        )}
      >
        {initials(person.name)}
      </span>
    </div>
  );
}

/**
 * Stacked card form — used where a grid is right. The /about leadership index
 * uses the editorial row treatment instead and calls PersonPortrait directly.
 */
export function PersonCard({
  person,
  className,
}: {
  person: Person;
  className?: string;
}) {
  return (
    <article className={cn("border-t border-rule pt-6", className)}>
      <PersonPortrait person={person} />
      <h3 className="type-subhead mt-6 text-h3">{person.name}</h3>
      <p className="type-eyebrow mt-2 text-ink-muted">{person.role}</p>
      <div className="measure mt-4 space-y-3 text-ink-muted">
        {person.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {person.credentials.length > 0 && (
        <ul className="mt-5 space-y-1.5">
          {person.credentials.map((credential) => (
            <li key={credential} className="type-eyebrow text-ink-muted">
              {credential}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
