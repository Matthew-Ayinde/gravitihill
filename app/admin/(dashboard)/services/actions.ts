"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { practiceSchema } from "@/lib/schemas";
import { upsertPractice, deletePractice } from "@/lib/repositories/practices";
import { requireSession } from "@/lib/auth";
import { getAllTrimmed, getImg, optionalStr, str, zipIconRows } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function savePracticeAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const parsed = practiceSchema.safeParse({
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    proposition: str(formData, "proposition"),
    thesis: getAllTrimmed(formData, "thesis"),
    offerings: zipIconRows(formData, "offerings"),
    relatedSectors: getAllTrimmed(formData, "relatedSectors"),
    cover: getImg(formData, "cover"),
    platformHref: optionalStr(formData, "platformHref"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  if (originalSlug && originalSlug !== parsed.data.slug) {
    await deletePractice(originalSlug);
  }

  await upsertPractice(parsed.data);
  updateTag("practices");
  redirect(`/admin/services/${parsed.data.slug}?saved=1`);
}

export async function deletePracticeAction(slug: string): Promise<void> {
  await requireSession();
  await deletePractice(slug);
  updateTag("practices");
  redirect("/admin/services");
}
