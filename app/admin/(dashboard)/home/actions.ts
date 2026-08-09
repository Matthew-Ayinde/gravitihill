"use server";

import { HOME_HERO_MAX_ITEMS, homeHeroSchema } from "@/lib/schemas";
import { updateHomeHero } from "@/lib/home-hero";
import { requireSession } from "@/lib/auth";
import { getImgList } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function saveHeroAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const parsed = homeHeroSchema.safeParse({
    items: getImgList(formData, "items", HOME_HERO_MAX_ITEMS),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await updateHomeHero(parsed.data);
  return { ok: true, message: "Saved." };
}
