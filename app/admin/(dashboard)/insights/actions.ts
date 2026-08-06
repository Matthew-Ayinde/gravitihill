"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { insightSchema, type Insight } from "@/lib/schemas";
import { upsertInsight, deleteInsight } from "@/lib/repositories/insights";
import { requireSession } from "@/lib/auth";
import { getImg, str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

function zipBody(formData: FormData): Insight["body"] {
  const types = formData.getAll("body.type").map(String);
  const texts = formData.getAll("body.text").map(String);
  const items = formData.getAll("body.items").map(String);

  return types
    .map((type, i) => {
      if (type === "list") {
        const list = (items[i] ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        return list.length > 0 ? { type: "list" as const, items: list } : null;
      }
      const text = (texts[i] ?? "").trim();
      if (!text) return null;
      if (type === "h2") return { type: "h2" as const, text };
      if (type === "quote") return { type: "quote" as const, text };
      return { type: "p" as const, text };
    })
    .filter((block): block is NonNullable<typeof block> => block !== null);
}

export async function saveInsightAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const parsed = insightSchema.safeParse({
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    excerpt: str(formData, "excerpt"),
    category: str(formData, "category"),
    author: str(formData, "author"),
    publishedAt: str(formData, "publishedAt"),
    readingTime: Number(str(formData, "readingTime")),
    coverImage: getImg(formData, "coverImage"),
    placeholderBody: formData.get("placeholderBody") === "on",
    body: zipBody(formData),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  if (originalSlug && originalSlug !== parsed.data.slug) {
    await deleteInsight(originalSlug);
  }

  await upsertInsight(parsed.data);
  updateTag("insights");
  redirect(`/admin/insights/${parsed.data.slug}?saved=1`);
}

export async function deleteInsightAction(slug: string): Promise<void> {
  await requireSession();
  await deleteInsight(slug);
  updateTag("insights");
  redirect("/admin/insights");
}
