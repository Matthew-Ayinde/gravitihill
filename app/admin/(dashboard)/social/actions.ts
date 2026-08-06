"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { socialPostSchema } from "@/lib/schemas";
import { upsertSocialPost, deleteSocialPost, listSocialPosts } from "@/lib/repositories/social";
import { requireSession } from "@/lib/auth";
import { str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function saveSocialPostAction(
  originalId: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const format = str(formData, "format");
  const shared = { id: str(formData, "id"), href: str(formData, "href"), postedAt: str(formData, "postedAt") };

  const candidate =
    format === "quote"
      ? { format, ...shared, quote: str(formData, "quote"), attribution: str(formData, "attribution") }
      : format === "stat"
        ? { format, ...shared, value: str(formData, "value"), label: str(formData, "label"), source: str(formData, "source") }
        : { format: "cover" as const, ...shared, kicker: str(formData, "kicker"), title: str(formData, "title") };

  const parsed = socialPostSchema.safeParse(candidate);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const orderValue = Number(str(formData, "order"));
  const order = Number.isFinite(orderValue) ? orderValue : (await listSocialPosts()).length;

  if (originalId && originalId !== parsed.data.id) {
    await deleteSocialPost(originalId);
  }

  await upsertSocialPost(parsed.data, order);
  updateTag("socialPosts");
  redirect(`/admin/social/${parsed.data.id}?saved=1`);
}

export async function deleteSocialPostAction(id: string): Promise<void> {
  await requireSession();
  await deleteSocialPost(id);
  updateTag("socialPosts");
  redirect("/admin/social");
}
