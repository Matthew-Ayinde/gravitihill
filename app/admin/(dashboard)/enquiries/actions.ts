"use server";

import { revalidatePath } from "next/cache";
import { setSubmissionStatus, type SubmissionStatus } from "@/lib/repositories/contact-submissions";
import { requireSession } from "@/lib/auth";

export async function setStatusAction(id: string, status: SubmissionStatus): Promise<void> {
  await requireSession();
  await setSubmissionStatus(id, status);
  revalidatePath("/admin/enquiries");
}
