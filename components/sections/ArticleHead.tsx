import Link from "next/link";
import { Entrance } from "@/components/motion/Entrance";
import { FocusTitle } from "@/components/motion/FocusTitle";
import type { Insight } from "@/lib/schemas";
import { editorialDate, indexNumber } from "@/lib/utils";

/**
 * /insights/[slug] — the opening of a piece.
 *
 * A way back, the title, and the record of the piece (date, length, author)
 * set against its excerpt. The title focuses in (<FocusTitle>); <Entrance>
 * composes the furniture around it. No photograph here: the cover follows
 * directly and gets its own moment.
 */
export function ArticleHead({ insight, issue }: { insight: Insight; issue: number }) {
  const record = [
    {
      label: "Published",
      value: <time dateTime={insight.publishedAt}>{editorialDate(insight.publishedAt)}</time>,
    },
    { label: "Reading", value: `${insight.readingTime} min` },
    { label: "By", value: insight.author },
  ];

  return (
    <header className="pt-32 pb-14 lg:pt-40 lg:pb-20">
      <Entrance className="shell" delay={0.05}>
        <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 pb-4">
          <Link
            data-load
            href="/insights"
            className="back-link type-eyebrow inline-flex items-center gap-3 text-green"
          >
            <span aria-hidden="true" className="back-arrow">
              ←
            </span>
            <span className="link-draw">All insights</span>
          </Link>
          <p data-load className="type-eyebrow flex flex-wrap gap-x-5 text-ink-muted">
            <span>{insight.category}</span>
            <span className="tabular-nums">No. {indexNumber(issue - 1)}</span>
          </p>
          <span aria-hidden="true" className="hero-rule absolute inset-x-0 bottom-0 h-px bg-rule" />
        </div>
      </Entrance>

      <div className="shell mt-12 lg:mt-20">
        <FocusTitle
          id="article-title"
          text={insight.title}
          className="max-w-[22ch] text-h1 text-ink-display lg:text-hero"
        />
      </div>

      <Entrance className="shell mt-12 lg:mt-16" delay={0.75}>
        <div className="grid-12 items-start gap-y-8 border-t border-rule pt-8">
          <dl className="col-span-12 grid grid-cols-3 gap-6 lg:col-span-5">
            {record.map((item) => (
              <div key={item.label} data-load>
                <dt className="type-eyebrow text-ink-muted">{item.label}</dt>
                <dd className="type-subhead mt-2 text-body-lg tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p
            data-load
            className="measure-tight col-span-12 text-body-lg text-ink-muted lg:col-span-6 lg:col-start-7"
          >
            {insight.excerpt}
          </p>
        </div>
      </Entrance>
    </header>
  );
}
