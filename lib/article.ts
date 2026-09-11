import type { Insight } from "@/lib/schemas";
import { indexNumber } from "@/lib/utils";

type Block = Insight["body"][number];

/** One part of an article: everything under one h2 (or before the first). */
export type ArticlePart = {
  /** Anchor id — `part-01`, `part-02`, … */
  id: string;
  /** What the reading guide lists. The heading, or "Opening" for the lead-in. */
  label: string;
  heading?: string;
  blocks: Block[];
};

/**
 * Groups the flat block array into parts at each h2.
 *
 * The body stays a flat array in the CMS; the page wants sections — for real
 * <section> landmarks, for anchor targets, and so the reading guide can track
 * progress through each one. Text before the first heading becomes an
 * "Opening" part; a body that starts on a heading simply has none.
 */
export function toParts(body: Insight["body"]): ArticlePart[] {
  const parts: ArticlePart[] = [];
  let current: ArticlePart = { id: indexId(0), label: "Opening", blocks: [] };

  for (const block of body) {
    if (block.type === "h2") {
      if (current.heading || current.blocks.length > 0) parts.push(current);
      current = { id: indexId(parts.length), label: block.text, heading: block.text, blocks: [] };
    } else {
      current.blocks.push(block);
    }
  }

  if (current.heading || current.blocks.length > 0) parts.push(current);
  return parts;
}

function indexId(i: number): string {
  return `part-${indexNumber(i)}`;
}
