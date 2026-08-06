import type { Metadata } from "next";
import { listSocialPosts } from "@/lib/repositories/social";
import { SocialPostForm } from "@/components/admin/forms/SocialPostForm";

export const metadata: Metadata = { title: "New social post", robots: { index: false } };

export default async function NewSocialPostPage() {
  const posts = await listSocialPosts();

  return (
    <div>
      <p className="type-eyebrow text-green">Social wall</p>
      <h1 className="type-display mt-3 text-h1">New post.</h1>
      <div className="mt-12">
        <SocialPostForm order={posts.length} />
      </div>
    </div>
  );
}
