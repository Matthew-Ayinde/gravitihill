"use server";

import { settingsSchema, type Settings } from "@/lib/schemas";
import { updateSiteSettings } from "@/lib/settings";
import { requireSession } from "@/lib/auth";
import { str } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

function zipPhones(formData: FormData): Settings["phones"] {
  const displays = formData.getAll("phones.display").map(String);
  const e164s = formData.getAll("phones.e164").map(String);
  // Only checked boxes appear in FormData, valued with their row index.
  const checked = new Set(formData.getAll("phones.whatsapp").map(String));

  return displays
    .map((display, i) => ({
      display: display.trim(),
      e164: (e164s[i] ?? "").trim(),
      whatsapp: checked.has(String(i)),
    }))
    .filter((phone) => phone.display && phone.e164);
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const parsed = settingsSchema.safeParse({
    address: {
      street: str(formData, "street"),
      locality: str(formData, "locality"),
      region: str(formData, "region"),
      country: str(formData, "country"),
      countryCode: str(formData, "countryCode"),
    },
    phones: zipPhones(formData),
    email: str(formData, "email"),
    linkedin: str(formData, "linkedin"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await updateSiteSettings(parsed.data);
  return { ok: true, message: "Saved." };
}
