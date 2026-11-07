"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { articleBlockSchema, insightSchema, type Insight } from "@/lib/schemas";
import { upsertInsight, deleteInsight } from "@/lib/repositories/insights";
import { requireSession } from "@/lib/auth";
import { getImg, str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

/**
 * BlockEditor submits the body as one JSON field. Each block is validated
 * against the schema, trimmed, and dropped if it says nothing — except image
 * blocks, which are kept even when empty: an empty one is a deliberate slot.
 * Returns null when the field is not valid JSON at all.
 */
function parseBody(formData: FormData): Insight["body"] | null {
  let raw: unknown;
  try {
    raw = JSON.parse(str(formData, "body") || "[]");
  } catch {
    return null;
  }
  if (!Array.isArray(raw)) return null;

  const blocks: Insight["body"] = [];
  for (const item of raw) {
    const parsed = articleBlockSchema.safeParse(item);
    if (!parsed.success) continue;
    const block = parsed.data;
    switch (block.type) {
      case "list": {
        const items = block.items.map((s) => s.trim()).filter(Boolean);
        if (items.length > 0) blocks.push({ ...block, items });
        break;
      }
      case "image":
        blocks.push({ ...block, alt: block.alt.trim(), caption: block.caption?.trim() || undefined });
        break;
      case "divider":
        blocks.push(block);
        break;
      case "quote": {
        const text = block.text.trim();
        if (text) blocks.push({ ...block, text, cite: block.cite?.trim() || undefined });
        break;
      }
      default: {
        const text = block.text.trim();
        if (text) blocks.push({ ...block, text });
      }
    }
  }
  return blocks;
}

export async function saveInsightAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const body = parseBody(formData);
  if (!body) return { ok: false, message: "The article body could not be read. Reload and try again." };

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
    body,
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
