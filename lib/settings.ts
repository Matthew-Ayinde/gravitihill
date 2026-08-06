import { unstable_cache, updateTag } from "next/cache";
import { getSettings as getSettingsDoc, saveSettings as saveSettingsDoc } from "@/lib/repositories/settings";
import { ADDRESS, EMAIL, LINKEDIN, PHONES } from "@/lib/site";
import type { Settings } from "@/lib/schemas";

/**
 * The admin-editable NAP. lib/site.ts keeps ADDRESS/PHONES/EMAIL/LINKEDIN as
 * compiled-in fallback defaults — this getter reads the `settings` singleton
 * from Mongo and falls back to those constants only if no document exists
 * yet (i.e. before the first seed/save), so the footer, /contact and the
 * Organization JSON-LD never break.
 */

const DEFAULT_SETTINGS: Settings = {
  address: ADDRESS,
  phones: [...PHONES],
  email: EMAIL,
  linkedin: LINKEDIN,
};

const readSettings = unstable_cache(
  async (): Promise<Settings> => (await getSettingsDoc()) ?? DEFAULT_SETTINGS,
  ["settings"],
  { tags: ["settings"], revalidate: 3600 },
);

export async function getSiteSettings(): Promise<Settings> {
  return readSettings();
}

export async function updateSiteSettings(input: Settings): Promise<void> {
  await saveSettingsDoc(input);
  updateTag("settings");
}

/**
 * WhatsApp deeplink for the primary number (the first one flagged
 * `whatsapp: true`), message prefilled. In this market WhatsApp converts
 * better than a form — it gets equal visual weight on /contact, not a
 * footnote — so /contact and /the-naked-board both compute this from live
 * settings rather than a hardcoded constant.
 */
export function whatsappUrl(settings: Settings): string {
  const phone = settings.phones.find((p) => p.whatsapp) ?? settings.phones[0];
  return `https://wa.me/${phone.e164.replace("+", "")}?text=${encodeURIComponent(
    "Hello Graviti Hill — I would like to discuss a project.",
  )}`;
}
