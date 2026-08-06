"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { sectorSchema } from "@/lib/schemas";
import { upsertSector, deleteSector, listSectors } from "@/lib/repositories/sectors";
import { requireSession } from "@/lib/auth";
import { getAllTrimmed, getImg, str, zipIconRows, zipNoteRows } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function saveSectorAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const parsed = sectorSchema.safeParse({
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    proposition: str(formData, "proposition"),
    thesis: getAllTrimmed(formData, "thesis"),
    approach: zipIconRows(formData, "approach"),
    differentiators: zipNoteRows(formData, "differentiators"),
    image: getImg(formData, "image"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const orderValue = Number(str(formData, "order"));
  const order = Number.isFinite(orderValue) ? orderValue : (await listSectors()).length;

  if (originalSlug && originalSlug !== parsed.data.slug) {
    await deleteSector(originalSlug);
  }

  await upsertSector(parsed.data, order);
  updateTag("sectors");
  redirect(`/admin/sectors/${parsed.data.slug}?saved=1`);
}

export async function deleteSectorAction(slug: string): Promise<void> {
  await requireSession();
  await deleteSector(slug);
  updateTag("sectors");
  redirect("/admin/sectors");
}
