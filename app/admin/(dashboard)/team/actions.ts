"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { personSchema } from "@/lib/schemas";
import { upsertPerson, deletePerson, listTeam } from "@/lib/repositories/team";
import { requireSession } from "@/lib/auth";
import { getAllTrimmed, getImg, optionalStr, str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function savePersonAction(
  originalSlug: string | undefined,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const parsed = personSchema.safeParse({
    slug: str(formData, "slug"),
    name: str(formData, "name"),
    role: str(formData, "role"),
    bio: getAllTrimmed(formData, "bio"),
    credentials: getAllTrimmed(formData, "credentials"),
    photo: getImg(formData, "photo"),
    linkedin: optionalStr(formData, "linkedin"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const orderValue = Number(str(formData, "order"));
  const order = Number.isFinite(orderValue) ? orderValue : (await listTeam()).length;

  if (originalSlug && originalSlug !== parsed.data.slug) {
    await deletePerson(originalSlug);
  }

  await upsertPerson(parsed.data, order);
  updateTag("team");
  redirect(`/admin/team/${parsed.data.slug}?saved=1`);
}

export async function deletePersonAction(slug: string): Promise<void> {
  await requireSession();
  await deletePerson(slug);
  updateTag("team");
  redirect("/admin/team");
}
