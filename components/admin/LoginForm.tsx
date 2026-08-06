"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-10">
      <StatusBanner state={state} />

      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="type-eyebrow mb-2 block text-white/55">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-sm border border-rule-dark bg-white/5 px-4 py-3 text-body text-white placeholder:text-white/35 focus-visible:border-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="type-eyebrow mb-2 block text-white/55">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-sm border border-rule-dark bg-white/5 px-4 py-3 text-body text-white placeholder:text-white/35 focus-visible:border-white"
          />
        </div>
      </div>

      <SubmitButton pendingLabel="Signing in…" tone="dark" className="mt-8 w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
