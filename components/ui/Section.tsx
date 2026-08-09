import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section rhythm across the site is light-dominant with three deliberate dark
 * moments (Sectors, The Naked Board, contact). A dark panel should feel like a
 * held breath, not a theme change, so `ridge` sets the text colour and nothing
 * else; components inside opt into dark treatment explicitly.
 */
type Tone = "canvas" | "alt" | "ridge";

const TONE: Record<Tone, string> = {
  canvas: "bg-canvas text-ink",
  alt: "bg-canvas-alt text-ink",
  ridge: "bg-ridge text-white",
};

export function Section({
  children,
  tone = "canvas",
  id,
  className,
  as = "section",
  labelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  as?: "section" | "div";
  labelledBy?: string;
}) {
  const Tag = as;
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-section", TONE[tone], className)}
    >
      {children}
    </Tag>
  );
}

/**
 * The section eyebrow lives in the left margin as a sticky label: an index
 * number and a name, horizontal, never rotated. It holds position while the
 * section's content scrolls past it.
 */
export function SectionLabel({
  index,
  children,
  tone = "light",
  className,
}: {
  index: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-eyebrow sticky top-28 hidden lg:block",
        tone === "dark" ? "text-white/55" : "text-ink-muted",
        className,
      )}
    >
      <span className={tone === "dark" ? "text-accent" : "text-green"}>
        {index}
      </span>
      <span aria-hidden="true" className="mx-2">
        -
      </span>
      {children}
    </p>
  );
}

/**
 * Mobile counterpart to SectionLabel: the sticky margin label has nowhere to
 * live under 1024px, so it sits inline above the heading instead.
 */
export function SectionLabelInline({
  index,
  children,
  tone = "light",
  className,
}: {
  index: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "type-eyebrow mb-6 lg:hidden",
        tone === "dark" ? "text-white/55" : "text-ink-muted",
        className,
      )}
    >
      <span className={tone === "dark" ? "text-accent" : "text-green"}>
        {index}
      </span>
      <span aria-hidden="true" className="mx-2">
        -
      </span>
      {children}
    </p>
  );
}
