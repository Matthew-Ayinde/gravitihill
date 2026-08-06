import Link from "next/link";
import type { Metadata } from "next";
import { listSocialPosts } from "@/lib/repositories/social";

export const metadata: Metadata = { title: "Social wall", robots: { index: false } };

function titleFor(post: Awaited<ReturnType<typeof listSocialPosts>>[number]): string {
  if (post.format === "quote") return post.quote;
  if (post.format === "stat") return post.label;
  return post.title;
}

export default async function AdminSocialPage() {
  const posts = await listSocialPosts();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Content</p>
          <h1 className="type-display mt-3 text-h1">Social wall</h1>
        </div>
        <Link href="/admin/social/new" className="link-draw type-eyebrow">
          + New post
        </Link>
      </div>

      <ul className="mt-12 border-t border-rule">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-rule py-6">
            <Link href={`/admin/social/${post.id}`} className="flex items-baseline justify-between gap-6 hover:opacity-70">
              <span>
                <span className="type-eyebrow text-ink-muted">{post.format}</span>
                <span className="type-subhead mt-1 block text-h3">{titleFor(post)}</span>
              </span>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="py-10 text-body-lg text-ink-muted">No posts yet.</li>
        )}
      </ul>
    </div>
  );
}
