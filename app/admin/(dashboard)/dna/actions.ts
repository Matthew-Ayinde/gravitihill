"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { pillarSchema } from "@/lib/schemas";
import { upsertDnaPillar, deleteDnaPillar, listDnaPillars } from "@/lib/repositories/dna";
import { requireSession } from "@/lib/auth";
import { str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function savePillarAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const parsed = pillarSchema.safeParse({
    name: str(formData, "name"),
    icon: str(formData, "icon"),
    summary: str(formData, "summary"),
    detail: str(formData, "detail"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const orderValue = Number(str(formData, "order"));
  const order = Number.isFinite(orderValue) ? orderValue : (await listDnaPillars()).length;

  // Renaming derives a new slug (upsertDnaPillar keys by name) — remove the old record.
  if (originalSlug) {
    await deleteDnaPillar(originalSlug);
  }

  await upsertDnaPillar(parsed.data, order);
  updateTag("dnaPillars");
  redirect("/admin/dna?saved=1");
}

export async function deletePillarAction(slug: string): Promise<void> {
  await requireSession();
  await deleteDnaPillar(slug);
  updateTag("dnaPillars");
  redirect("/admin/dna");
}
