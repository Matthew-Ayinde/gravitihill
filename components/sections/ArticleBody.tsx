import { ProseMotion } from "@/components/motion/ProseMotion";
import { ShareActions } from "@/components/sections/ShareActions";
import type { ArticlePart } from "@/lib/article";
import { cn, indexNumber, wordTokens } from "@/lib/utils";

/**
 * Renders an article's parts (see lib/article.ts) as real <section>s.
 *
 * ── MDX seam ────────────────────────────────────────────────────────────────
 * When MDX lands, `body` becomes a compiled source and only this component and
 * lib/article.ts change — the page, the schema consumers and the index stay put.
 *
 * Long-form discipline holds whatever the motion does: 68-character measure,
 * no drop cap, body copy in full ink. Motion lives entirely in <ProseMotion>,
 * which finds these blocks by data attribute — this file is markup only:
 *
 *   [data-prose-p]        paragraphs — sharpen into place
 *   [data-prose-heading]  section heads — a numbered rule draws, then the words
 *   [data-prose-quote]    the pull quote — a bar grows, the words build
 *   [data-prose-list]     lists — each item's green tick draws before its text
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
      {parts.map((part, partIndex) => (
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

          {part.blocks.map((block, i) => {
            switch (block.type) {
              case "quote":
                return (
                  <figure key={i} data-prose-quote className="relative my-14 py-1 pl-8 lg:my-20 lg:pl-10">
                    <span
                      aria-hidden="true"
                      data-quote-bar
                      className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-green"
                    />
                    <blockquote className="type-display text-h2 text-green">
                      <span className="sr-only">{block.text}</span>
                      <span aria-hidden="true">
                        {wordTokens(block.text).map((token, t) =>
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
                  </figure>
                );

              case "list":
                return (
                  <ul key={i} data-prose-list className="measure my-10 border-t border-rule">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-5 border-b border-rule py-5">
                        <span
                          aria-hidden="true"
                          data-item-tick
                          data-motion
                          className="mt-3.5 h-px w-6 shrink-0 origin-left bg-green"
                        />
                        <span data-item-text data-motion className="text-body-lg text-ink">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                );

              case "p":
              default:
                return (
                  <p
                    key={i}
                    data-prose-p
                    data-motion
                    className={cn("measure text-body-lg text-ink", i > 0 && "mt-6")}
                  >
                    {block.text}
                  </p>
                );
            }
          })}
        </section>
      ))}

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
