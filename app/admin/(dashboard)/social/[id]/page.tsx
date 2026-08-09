import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findSocialPost, listSocialPosts } from "@/lib/repositories/social";
import { SocialPostForm } from "@/components/admin/forms/SocialPostForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SavedToast } from "@/components/admin/SavedToast";
import { deleteSocialPostAction } from "../actions";

export const metadata: Metadata = { title: "Edit social post", robots: { index: false } };

export default async function EditSocialPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const [post, posts, { saved }] = await Promise.all([findSocialPost(id), listSocialPosts(), searchParams]);
  if (!post) notFound();

  const order = posts.findIndex((p) => p.id === id);

  return (
    <div>
      <SavedToast saved={saved === "1"} />
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
