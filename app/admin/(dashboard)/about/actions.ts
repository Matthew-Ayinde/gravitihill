"use server";

import { updateTag } from "next/cache";
import { ABOUT_HERO_MAX_ITEMS, aboutSchema, type About } from "@/lib/schemas";
import { saveAbout } from "@/lib/repositories/about";
import { requireSession } from "@/lib/auth";
import { str, getImgList } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

function zipOrigin(formData: FormData): About["origin"] {
  const headings = formData.getAll("origin.heading").map(String);
  const bodyIndexes = formData.getAll("origin.bodyIndex").map(Number);
  const bodyTexts = formData.getAll("origin.bodyText").map(String);

  return headings
    .map((heading, i) => {
      const body = bodyIndexes
        .map((blockIndex, j) => (blockIndex === i ? bodyTexts[j]?.trim() : undefined))
        .filter((text): text is string => Boolean(text));
      return { heading: heading.trim(), body };
    })
    .filter((block) => block.heading && block.body.length > 0);
}

function zipFacts(formData: FormData): About["facts"] {
  const labels = formData.getAll("facts.label").map(String);
  const values = formData.getAll("facts.value").map(String);
  return labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] ?? "").trim() }))
    .filter((fact) => fact.label && fact.value);
}

export async function saveAboutAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireSession();

  const parsed = aboutSchema.safeParse({
    positioning: str(formData, "positioning"),
    purpose: str(formData, "purpose"),
    precis: str(formData, "precis"),
    origin: zipOrigin(formData),
    pullQuote: str(formData, "pullQuote"),
    facts: zipFacts(formData),
    heroImages: getImgList(formData, "heroImages", ABOUT_HERO_MAX_ITEMS),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await saveAbout(parsed.data);
  updateTag("about");
  return { ok: true, message: "Saved." };
}
