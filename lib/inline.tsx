import type { ReactNode } from "react";

/**
 * The inline syntax article text accepts — and nothing more:
 *
 *   **bold**   *italic*   [label](https://…)
 *
 * Small enough to type in a plain textarea and read back without a preview,
 * and parsed here rather than by a markdown library, which would cost bundle
 * and accept far more than the article design has room for. Markers nest one
 * level (`***bold italic***`, `**[a link](…)**`). Anything unmatched renders
 * as the literal text, so a stray asterisk is never lost.
 */

const TOKEN = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(TOKEN)) {
    const [whole, boldItalic, bold, italic, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));

    if (boldItalic !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold">
          <em>{renderInline(boldItalic)}</em>
        </strong>,
      );
    } else if (bold !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold">
          {renderInline(bold)}
        </strong>,
      );
    } else if (italic !== undefined) {
      out.push(<em key={key++}>{renderInline(italic)}</em>);
    } else if (label !== undefined && href !== undefined && isSafeHref(href)) {
      const external = /^https?:\/\//.test(href);
      out.push(
        <a
          key={key++}
          href={href}
          className="text-green underline decoration-1 underline-offset-4 hover:decoration-2"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {renderInline(label)}
        </a>,
      );
    } else {
      out.push(whole);
    }
    last = start + whole.length;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The same text with the markers removed — for labels, metadata and JSON-LD. */
export function stripInline(text: string): string {
  return text.replace(TOKEN, (_whole, bi, b, i, label) => bi ?? b ?? i ?? label ?? "");
}

/** Links go to the web, to mail, to a phone, or within the site. Never `javascript:`. */
function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:|\/|#)/.test(href);
}
