import { Section, SectionLabel, SectionLabelInline } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { SOCIAL_POSTS } from "@/content/social";
import type { SocialPost } from "@/lib/schemas";
import { editorialDate } from "@/lib/utils";

/**
 * Static social wall — three post formats taken from the brand's own
 * templates: Quote Card, Stat Card, Article Cover.
 *
 * Rendered from content/social.ts as ordinary markup. No live embeds, no
 * third-party scripts, no iframes: a LinkedIn embed would put a tracking
 * script and a render-blocking origin on the home route in exchange for three
 * cards we can set better ourselves.
 *
 * Desktop: a three-across editorial grid. Mobile: a horizontal snap-scroll
 * rail, which is how these are read on a phone anyway.
 */
export function SocialWall({ index = "05" }: { index?: string }) {
  return (
    <Section labelledBy="social-heading">
      <div className="shell grid-12 gap-y-8">
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel index={index}>Signals</SectionLabel>
          <SectionLabelInline index={index}>Signals</SectionLabelInline>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <h2 id="social-heading" className="type-display max-w-[18ch] text-h2">
            What we have been saying out loud.
          </h2>
        </div>
      </div>

      {/* The rail breaks the shell on mobile so cards can bleed to the edge. */}
      <div className="mt-14 overflow-x-auto md:overflow-visible">
        <RevealGroup
          as="ul"
          className="shell flex snap-x snap-mandatory gap-px md:grid md:grid-cols-3"
        >
          {SOCIAL_POSTS.map((post) => (
            <RevealItem
              as="li"
              key={post.id}
              className="w-[85vw] shrink-0 snap-start md:w-auto"
            >
              <SocialCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

function SocialCard({ post }: { post: SocialPost }) {
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full min-h-[22rem] flex-col justify-between border border-rule bg-canvas p-8 transition-colors duration-200 ease-brand hover:bg-canvas-alt"
    >
      <p className="type-eyebrow text-ink-muted">
        {post.format === "quote" && "Quote"}
        {post.format === "stat" && "Figure"}
        {post.format === "cover" && post.kicker}
      </p>

      <div className="py-10">
        {post.format === "quote" && (
          <blockquote>
            <p className="type-display text-h3">{post.quote}</p>
            <footer className="type-eyebrow mt-6 text-ink-muted">
              {post.attribution}
            </footer>
          </blockquote>
        )}

        {post.format === "stat" && (
          <>
            <p className="type-display text-hero leading-none text-green">
              {post.value}
            </p>
            <p className="measure-tight mt-5 text-body-lg">{post.label}</p>
            <p className="type-eyebrow mt-4 text-ink-muted">{post.source}</p>
          </>
        )}

        {post.format === "cover" && (
          <p className="type-display text-h3">{post.title}</p>
        )}
      </div>

      <p className="type-eyebrow flex items-center justify-between text-ink-muted">
        <time dateTime={post.postedAt}>{editorialDate(post.postedAt)}</time>
        <span>LinkedIn ↗</span>
      </p>
    </a>
  );
}
