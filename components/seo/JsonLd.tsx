/**
 * Renders one or more JSON-LD graphs.
 *
 * Server component — the payload is serialised into the HTML and never reaches
 * the client bundle. `<` is escaped so a content string can never terminate the
 * script element early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- structured data has no other insertion point
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
