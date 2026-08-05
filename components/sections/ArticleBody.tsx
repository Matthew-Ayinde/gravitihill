import type { Insight } from "@/lib/schemas";

/**
 * Renders the typed block array from content/insights.ts.
 *
 * ── MDX seam ────────────────────────────────────────────────────────────────
 * When MDX lands, `body` becomes a compiled source and only this component
 * changes — the article page, the schema consumers and the index all stay put.
 *
 * Measure is capped at 68 characters. No drop cap: a drop cap is a magazine
 * device and this is a position paper.
 */
export function ArticleBody({ body }: { body: Insight["body"] }) {
  return (
    <div className="measure">
      {body.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="type-display mt-16 mb-6 text-h3 first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="my-12 border-t border-rule pt-8"
              >
                <p className="type-display text-h3 text-green">{block.text}</p>
              </blockquote>
            );

          case "list":
            return (
              <ul key={i} className="my-8 border-t border-rule">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-rule py-4 text-body-lg text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "p":
          default:
            return (
              <p key={i} className="mt-6 text-body-lg first:mt-0">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
