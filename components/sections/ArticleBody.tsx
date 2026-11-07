import { ProseMotion } from "@/components/motion/ProseMotion";
import { ShareActions } from "@/components/sections/ShareActions";
import { NaturalImage } from "@/components/ui/FitImage";
import type { ArticlePart } from "@/lib/article";
import { renderInline, stripInline } from "@/lib/inline";
import type { ArticleBlock } from "@/lib/schemas";
import { cn, indexNumber, wordTokens } from "@/lib/utils";

/**
 * Renders an article's parts (see lib/article.ts) as real <section>s.
 *
 * ── MDX seam ────────────────────────────────────────────────────────────────
 * When MDX lands, `body` becomes a compiled source and only this component and
 * lib/article.ts change — the page, the schema consumers and the index stay put.
 *
 * Long-form discipline holds whatever the motion does: 68-character measure,
 * no drop cap, body copy in full ink. Images are the one thing allowed out to
 * the full body column, and they are always shown whole (<NaturalImage>).
 * Motion lives entirely in <ProseMotion>, which finds these blocks by data
 * attribute — this file is markup only:
 *
 *   [data-prose-p]        paragraphs, the lead, sub-heads, figures — sharpen into place
 *   [data-prose-heading]  section heads — a numbered rule draws, then the words
 *   [data-prose-quote]    the pull quote — a bar grows, the words build
 *   [data-prose-list]     lists — each item's tick or numeral lands before its text
 *   [data-prose-end]      the end of the piece — rule, mark, then the close
 */
export function ArticleBody({
  parts,
  title,
  url,
  email,
}: {
  parts: ArticlePart[];
  title: string;
  url: string;
  email: string;
}) {
  return (
    <ProseMotion>
      {parts.map((part, partIndex) => {
        // Image slots left empty in the CMS render nothing, and take no space.
        const blocks = part.blocks.filter((b) => b.type !== "image" || b.image);
        return (
          <section
            key={part.id}
            id={part.id}
            data-part
            aria-labelledby={part.heading ? `${part.id}-heading` : undefined}
            className="scroll-mt-32 pt-20 first:pt-0 lg:pt-24"
          >
            {part.heading && (
              <h2 id={`${part.id}-heading`} data-prose-heading className="measure mb-8">
                <span aria-hidden="true" className="flex items-center gap-4">
                  <span data-heading-num className="type-eyebrow tabular-nums text-green">
                    {indexNumber(partIndex)}
                  </span>
                  <span data-heading-rule className="h-px flex-1 origin-left bg-rule" />
                </span>
                <span className="line-mask mt-5">
                  <span data-heading-text className="type-display block max-w-[24ch] text-h2 text-ink-display">
                    {part.heading}
                  </span>
                </span>
              </h2>
            )}

            {blocks.map((block, i) => (
              <Block key={i} block={block} className={gap(block, blocks[i - 1])} />
            ))}
          </section>
        );
      })}

      <footer data-prose-end className="measure mt-20 lg:mt-24">
        <div aria-hidden="true" className="flex items-center gap-4">
          <span data-end-rule data-motion className="h-px flex-1 origin-left bg-rule" />
          <span data-end-mark data-motion className="block h-2.5 w-2.5 bg-green" />
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <div data-end-fade data-motion>
            <p className="type-eyebrow text-ink-muted">Disagree?</p>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${title}`)}`}
              className="type-subhead mt-3 inline-block text-h3 text-ink-display"
            >
              <span className="link-draw">Write back on this piece</span>
            </a>
          </div>
          <div data-end-fade data-motion>
            <ShareActions url={url} title={title} />
          </div>
        </div>
      </footer>
    </ProseMotion>
  );
}

/**
 * Space above a block, from what it follows. Text runs close; a sub-head
 * opens room above itself and stays tight to its own paragraph; figures,
 * quotes and lists get room on both sides.
 */
function gap(block: ArticleBlock, prev: ArticleBlock | undefined): string | undefined {
  if (!prev) return undefined;
  if (block.type === "h3") return "mt-14 lg:mt-16";
  if (prev.type === "h3") return "mt-5";
  const roomy = (b: ArticleBlock) => b.type === "image" || b.type === "quote" || b.type === "divider";
  if (roomy(block) || roomy(prev)) return "mt-14 lg:mt-20";
  if (block.type === "list" || prev.type === "list" || block.type === "lead" || prev.type === "lead") {
    return "mt-8 lg:mt-10";
  }
  return "mt-6";
}

function Block({ block, className }: { block: ArticleBlock; className?: string }) {
  switch (block.type) {
    case "lead":
      return (
        <p
          data-prose-p
          data-motion
          className={cn(
            "measure border-l-2 border-green py-1 pl-6 text-body-lg font-medium text-ink italic lg:pl-8",
            className,
          )}
        >
          {renderInline(block.text)}
        </p>
      );

    case "h3": {
      // A leading "1." is set as an index numeral; the words stay exactly as written.
      const numbered = /^(\d+)[.)]\s+(.+)$/.exec(block.text);
      return (
        <h3 data-prose-p data-motion className={cn("measure flex items-baseline gap-4", className)}>
          {numbered && (
            <span className="type-eyebrow shrink-0 tabular-nums text-green">
              <span className="sr-only">{numbered[1]}. </span>
              <span aria-hidden="true">{indexNumber(Number(numbered[1]) - 1)}</span>
            </span>
          )}
          <span className="type-subhead text-h3 text-ink-display">
            {numbered ? numbered[2] : block.text}
          </span>
        </h3>
      );
    }

    case "quote": {
      const text = stripInline(block.text);
      return (
        <figure data-prose-quote className={cn("relative py-1 pl-8 lg:pl-10", className)}>
          <span
            aria-hidden="true"
            data-quote-bar
            className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-green"
          />
          <blockquote className="type-display text-h2 text-green">
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
              {wordTokens(text).map((token, t) =>
                /^\s+$/.test(token) ? (
                  token
                ) : (
                  <span key={t} data-quote-word data-motion className="inline-block">
                    {token}
                  </span>
                ),
              )}
            </span>
          </blockquote>
          {block.cite && (
            <figcaption className="type-eyebrow mt-6 text-ink-muted">{block.cite}</figcaption>
          )}
        </figure>
      );
    }

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List data-prose-list className={cn("measure border-t border-rule", className)}>
          {block.items.map((item, n) => (
            <li key={n} className="flex gap-5 border-b border-rule py-5">
              {block.ordered ? (
                <span
                  aria-hidden="true"
                  data-item-num
                  data-motion
                  className="type-eyebrow mt-1.5 w-6 shrink-0 tabular-nums text-green"
                >
                  {indexNumber(n)}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  data-item-tick
                  data-motion
                  className="mt-3.5 h-px w-6 shrink-0 origin-left bg-green"
                />
              )}
              <span data-item-text data-motion className="text-body-lg text-ink">
                {renderInline(item)}
              </span>
            </li>
          ))}
        </List>
      );
    }

    case "image": {
      if (!block.image) return null;
      const wide = block.size === "wide";
      return (
        <figure data-prose-p data-motion className={cn(wide ? "w-full" : "measure", className)}>
          <div className="overflow-hidden rounded-sm bg-canvas-alt">
            <NaturalImage
              image={block.image}
              alt={block.alt || block.image.alt}
              sizes={wide ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 46rem, 100vw"}
            />
          </div>
          {block.caption && (
            <figcaption className="measure mt-4 text-caption text-ink-muted">
              {renderInline(block.caption)}
            </figcaption>
          )}
        </figure>
      );
    }

    case "divider":
      return (
        <div data-prose-p data-motion aria-hidden="true" className={cn("measure flex items-center gap-4", className)}>
          <span className="h-px flex-1 bg-rule" />
          <span className="block h-1.5 w-1.5 bg-green" />
          <span className="h-px flex-1 bg-rule" />
        </div>
      );

    case "p":
    default:
      return (
        <p data-prose-p data-motion className={cn("measure text-body-lg text-ink", className)}>
          {renderInline(block.text)}
        </p>
      );
  }
}
