"use client";

import { useEffect } from "react";
import { useToast } from "@/components/admin/Toast";

export type ActionState = { ok: boolean; message: string } | null;

/**
 * Bridges a useActionState result into a toast notification (top-right, via
 * ToastProvider in app/admin/layout.tsx) rather than rendering an inline
 * banner. Every admin form calls this the same way it always did:
 * `<StatusBanner state={state} />` right after `useActionState`, so moving
 * every form's save/delete feedback to toast needed no changes anywhere but
 * here. Renders nothing itself.
 *
 * `useActionState` hands back a fresh object on every completed submission
 * (even a repeat of the same message), so the effect firing once per `state`
 * reference change is exactly "once per submission result" — no de-duping
 * logic needed, and nothing fires on mount since the initial state is null.
 */
export function StatusBanner({ state }: { state: ActionState }) {
  const pushToast = useToast();

  useEffect(() => {
    if (state) pushToast(state.ok ? "success" : "error", state.message);
  }, [state, pushToast]);

  return null;
}
