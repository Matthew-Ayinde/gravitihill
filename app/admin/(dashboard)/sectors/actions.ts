"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { sectorSchema } from "@/lib/schemas";
import { upsertSector, deleteSector, listSectors } from "@/lib/repositories/sectors";
import { requireSession } from "@/lib/auth";
import { getAllTrimmed, getImg, optionalStr, str, zipIconRows, zipNoteRows } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function saveSectorAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const position = zipNoteRows(formData, "position");
  const differencePoints = getAllTrimmed(formData, "differencePoints");
  const practiceNotes = zipNoteRows(formData, "practiceNotes");
  const panelPoints = getAllTrimmed(formData, "panelPoints");
  const parsed = sectorSchema.safeParse({
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    proposition: str(formData, "proposition"),
    thesis: getAllTrimmed(formData, "thesis"),
    position: position.length > 0 ? position : undefined,
    approach: zipIconRows(formData, "approach"),
    differentiators: zipNoteRows(formData, "differentiators"),
    image: getImg(formData, "image"),
    approachHeading: optionalStr(formData, "approachHeading"),
    differenceHeading: optionalStr(formData, "differenceHeading"),
    differencePoints: differencePoints.length > 0 ? differencePoints : undefined,
    practicesHeading: optionalStr(formData, "practicesHeading"),
    practiceNotes: practiceNotes.length > 0 ? practiceNotes : undefined,
    hidePractices: formData.get("hidePractices") === "on" || undefined,
    panelPoints: panelPoints.length > 0 ? panelPoints : undefined,
    ctaHeading: optionalStr(formData, "ctaHeading"),
    ctaBody: optionalStr(formData, "ctaBody"),
    ctaLabel: optionalStr(formData, "ctaLabel"),
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
