import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findSocialPost, listSocialPosts } from "@/lib/repositories/social";
import { SocialPostForm } from "@/components/admin/forms/SocialPostForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSocialPostAction } from "../actions";

export const metadata: Metadata = { title: "Edit social post", robots: { index: false } };

export default async function EditSocialPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, posts] = await Promise.all([findSocialPost(id), listSocialPosts()]);
  if (!post) notFound();

  const order = posts.findIndex((p) => p.id === id);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Social wall</p>
          <h1 className="type-display mt-3 text-h1">Edit post.</h1>
        </div>
        <DeleteButton action={deleteSocialPostAction.bind(null, id)} confirmMessage="Delete this post? This can't be undone." />
      </div>

      <div className="mt-12">
        <SocialPostForm post={post} order={order} />
      </div>
    </div>
  );
}
