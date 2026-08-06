import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { ShareRail } from "@/components/sections/ShareRail";
import { CtaPanel } from "@/components/sections/CtaPanel";
import { Section } from "@/components/ui/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getInsights, getInsight, getRelatedInsights } from "@/content/insights";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { editorialDate } from "@/lib/utils";

export async function generateStaticParams() {
  const insights = await getInsights();
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return {};

  return pageMetadata({
    title: insight.title,
    description: insight.excerpt,
    path: `/insights/${insight.slug}`,
    type: "article",
    publishedTime: insight.publishedAt,
    authors: [insight.author],
  });
}

export default async function InsightPage({
  params,
}: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const url = `${SITE.url}/insights/${insight.slug}`;
  const related = await getRelatedInsights(insight.slug);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(insight),
          breadcrumbJsonLd([
            { name: "Insights", path: "/insights" },
            { name: insight.title, path: `/insights/${insight.slug}` },
          ]),
        ]}
      />

      <article>
        {/* ── Article head ────────────────────────────────────────────── */}
        <header className="pt-36 pb-14 lg:pt-44">
          <div className="shell grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-9">
              <p className="type-eyebrow text-green">
                <Link href="/insights" className="link-draw">
                  Insights
                </Link>
                <span aria-hidden="true" className="mx-3 text-ink-muted">
                  /
                </span>
                <span className="text-ink-muted">{insight.category}</span>
              </p>

              <h1 className="type-display mt-6 text-h1">{insight.title}</h1>

              <p className="measure mt-8 text-body-lg text-ink-muted">
                {insight.excerpt}
              </p>
            </div>

            <dl className="col-span-12 self-end lg:col-span-3 lg:col-start-10">
              <div className="flex items-baseline justify-between gap-6 border-t border-rule py-3">
                <dt className="type-eyebrow text-ink-muted">Published</dt>
                <dd className="type-subhead text-body-lg">
                  <time dateTime={insight.publishedAt}>
                    {editorialDate(insight.publishedAt)}
                  </time>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-t border-rule py-3">
                <dt className="type-eyebrow text-ink-muted">Reading</dt>
                <dd className="type-subhead text-body-lg">
                  {insight.readingTime} min
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-t border-rule py-3">
                <dt className="type-eyebrow text-ink-muted">Author</dt>
                <dd className="type-subhead text-body-lg">{insight.author}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="shell">
          <EditorialImage
            image={insight.coverImage}
            caption={`${insight.category} — ${editorialDate(insight.publishedAt)}`}
            sizes="(min-width: 1440px) 1320px, 100vw"
            priority
          />
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <Section>
          <div className="shell grid-12 gap-y-10">
            <div className="col-span-12 lg:col-span-2">
              <ShareRail url={url} title={insight.title} />
            </div>

            <div className="col-span-12 lg:col-span-8 lg:col-start-4">
              {insight.placeholderBody && (
                <p className="type-eyebrow mb-12 border border-rule bg-canvas-alt px-5 py-4 text-ink-muted">
                  Placeholder body — this article is seeded scaffolding and is
                  awaiting editorial copy.
                </p>
              )}
              <ArticleBody body={insight.body} />
            </div>
          </div>
        </Section>
      </article>

      {/* ── Related ───────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <Section tone="alt" labelledBy="related-heading">
          <div className="shell grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="type-eyebrow text-ink-muted">
                <span className="text-green">02</span>
                <span aria-hidden="true" className="mx-2">
                  —
                </span>
                Related
              </p>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <h2 id="related-heading" className="type-display max-w-[16ch] text-h2">
                Read next.
              </h2>

              <ul className="mt-12 border-t border-rule">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/insights/${item.slug}`}
                      className="group flex flex-col gap-2 border-b border-rule py-8 transition-colors duration-200 ease-brand hover:bg-canvas lg:flex-row lg:items-baseline lg:gap-10"
                    >
                      <span className="type-eyebrow shrink-0 text-ink-muted lg:w-32">
                        <time dateTime={item.publishedAt}>
                          {editorialDate(item.publishedAt)}
                        </time>
                      </span>
                      <span className="flex-1">
                        <span className="type-subhead block text-h3">
                          {item.title}
                        </span>
                        <span className="measure mt-2 block text-ink-muted">
                          {item.excerpt}
                        </span>
                      </span>
                      <span className="type-eyebrow shrink-0 text-ink-muted lg:text-right">
                        {item.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      <CtaPanel eyebrow="Engage" heading="Bring us the version of this you are living." />
    </>
  );
}
