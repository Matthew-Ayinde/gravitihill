"use server";

import { revalidatePath } from "next/cache";
import { updateMediaAlt, deleteMedia } from "@/lib/repositories/media";
import { requireSession } from "@/lib/auth";

export async function updateAltAction(publicId: string, formData: FormData): Promise<void> {
  await requireSession();
  await updateMediaAlt(publicId, String(formData.get("alt") ?? "").trim());
  revalidatePath("/admin/media");
}

/**
 * Removes the asset from the library picker only — it does not call
 * Cloudinary's destroy API, so any content already using this image keeps
 * rendering from its embedded snapshot (imageSchema data is denormalized at
 * save time, not joined at read time).
 */
export async function deleteFromLibraryAction(publicId: string): Promise<void> {
  await requireSession();
  await deleteMedia(publicId);
  revalidatePath("/admin/media");
}
