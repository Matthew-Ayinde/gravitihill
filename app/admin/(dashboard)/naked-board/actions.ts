"use server";

import { updateTag } from "next/cache";
import { nakedBoardSchema } from "@/lib/schemas";
import { saveNakedBoard } from "@/lib/repositories/naked-board";
import { requireSession } from "@/lib/auth";
import { getAllTrimmed, str, zipIconRows } from "@/lib/admin/form";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function saveNakedBoardAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const stages = zipIconRows(formData, "stages").map((row) => ({
    name: row.name,
    icon: row.icon,
    summary: row.note,
  }));

  const parsed = nakedBoardSchema.safeParse({
    name: str(formData, "name"),
    premise: str(formData, "premise"),
    positioning: getAllTrimmed(formData, "positioning"),
    stages,
    audience: getAllTrimmed(formData, "audience"),
    commitment: str(formData, "commitment"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  await saveNakedBoard(parsed.data);
  updateTag("nakedBoard");
  return { ok: true, message: "Saved." };
}
