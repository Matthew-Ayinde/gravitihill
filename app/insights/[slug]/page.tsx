import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleHead } from "@/components/sections/ArticleHead";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { NextPiece } from "@/components/sections/NextPiece";
import { ReadingBar, ReadingRail } from "@/components/sections/ReadingGuide";
import { Develop } from "@/components/motion/Develop";
import { JsonLd } from "@/components/seo/JsonLd";
import { getInsights, getInsight, getRelatedInsights } from "@/content/insights";
import { toParts } from "@/lib/article";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

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

const BODY_ID = "article-body";

/**
 * A single piece, composed for reading:
 *
 *   head      the title focuses in; date, length and author beside the excerpt
 *   cover     the photograph develops from monochrome as the reader reaches it
 *   body      the text, with a reading guide beside it (a sticky bar on phones)
 *   next      one piece to read next, its photograph blooming from the cursor
 *
 * The measure stays at 68 characters and body copy stays in full ink: every
 * motion on this page settles once and gets out of the way of the reading.
 */
export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const [insight, insights, settings] = await Promise.all([
    getInsight(slug),
    getInsights(),
    getSiteSettings(),
  ]);
  if (!insight) notFound();

  const related = await getRelatedInsights(insight.slug);
  // Issue numbers match the index: newest piece, highest number.
  const issue = insights.length - insights.findIndex((item) => item.slug === insight.slug);
  const parts = toParts(insight.body);
  const outline = parts.map(({ id, label }) => ({ id, label }));
  const url = `${SITE.url}/insights/${insight.slug}`;
  const cover = insight.coverImage;

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

      <article aria-labelledby="article-title">
        <ArticleHead insight={insight} issue={issue} />

        {cover && (
          <Develop className="shell">
            <div className="relative aspect-3/2 overflow-hidden rounded-sm bg-canvas-alt">
              <div data-develop-media data-motion className="absolute inset-0">
                <Image
                  src={cover.src}
                  alt={cover.alt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1440px) 1296px, 100vw"
                  className="object-cover"
                  {...(cover.blurDataURL
                    ? { placeholder: "blur" as const, blurDataURL: cover.blurDataURL }
                    : {})}
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-ridge/8" />
            </div>
          </Develop>
        )}

        <div className="py-section">
          <div className="shell grid-12 gap-y-10">
            <aside className="hidden lg:col-span-3 lg:block">
              <ReadingRail bodyId={BODY_ID} minutes={insight.readingTime} parts={outline} />
            </aside>

            <div id={BODY_ID} className="col-span-12 lg:col-span-8 lg:col-start-5">
              {insight.placeholderBody && (
                <p className="type-eyebrow mb-14 border-l-2 border-green py-1 pl-4 text-ink-muted">
                  Placeholder body — this article is seeded scaffolding and is awaiting
                  editorial copy.
                </p>
              )}

              <ArticleBody parts={parts} title={insight.title} url={url} email={settings.email} />

              {/* A direct child of the body column, so it can stick for the
                  column's whole height. */}
              <ReadingBar bodyId={BODY_ID} minutes={insight.readingTime} parts={outline} />

            </div>
          </div>
        </div>
      </article>

      {related[0] && <NextPiece next={related[0]} also={related[1]} />}
    </>
  );
}
