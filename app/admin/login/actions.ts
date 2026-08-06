"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { findAdminByEmail } from "@/lib/repositories/admins";
import { createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/components/admin/StatusBanner";

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit(`admin-login:${ip}`);
  if (!limit.ok) {
    return { ok: false, message: "Too many attempts. Try again shortly." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password." };
  }

  const admin = await findAdminByEmail(email);
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !valid) {
    return { ok: false, message: "Incorrect email or password." };
  }

  await createSession({ sub: admin.email, email: admin.email });
  redirect("/admin");
}
