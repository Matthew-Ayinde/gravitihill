"use server";

import { revalidatePath } from "next/cache";
import { updateMediaAlt, deleteMedia } from "@/lib/repositories/media";
import { destroyImage } from "@/lib/cloudinary";
import { requireSession } from "@/lib/auth";

export async function updateAltAction(publicId: string, formData: FormData): Promise<void> {
  await requireSession();
  await updateMediaAlt(publicId, String(formData.get("alt") ?? "").trim());
  revalidatePath("/admin/media");
}

/**
 * Removes the asset from the library catalog and destroys it in Cloudinary
 * — a real delete, not just a hide. Content documents embed a resolved
 * snapshot of an image at save time rather than referencing this catalog by
 * id (see lib/repositories/media.ts's `toImg`), so any page still using this
 * asset keeps its own `src` string pointing at a now-destroyed file and will
 * show a broken image — that trade-off is why the confirm dialog on
 * /admin/media spells it out before this runs, not a silent side effect.
 */
export async function deleteFromLibraryAction(publicId: string): Promise<void> {
  await requireSession();
  await destroyImage(publicId);
  await deleteMedia(publicId);
  revalidatePath("/admin/media");
}
