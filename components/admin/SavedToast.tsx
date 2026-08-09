"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";

/**
 * Fires the "Saved." toast for actions that redirect on success (team, dna,
 * social, insights, sectors, services) instead of returning an ActionState —
 * `redirect()` throws before a server action can return, so useActionState
 * never sees a success state and StatusBanner never fires for these flows.
 * The redirect target carries `?saved=1`; this reads it, toasts once, then
 * strips the param so a refresh doesn't re-toast. Renders nothing itself.
 *
 * `firedRef` is armed inside the effect body rather than a cleanup function:
 * StrictMode's dev-only double-invoke replays this exact effect (same
 * `saved: true`) synchronously with no real time passing, so a cleanup-based
 * reset would just re-arm it for the second invocation and toast twice. The
 * ref instead only re-arms once `saved` genuinely flips back to false — which
 * only happens after the real, async round trip through `router.replace` —
 * so a later legitimate save on the same route still toasts once.
 */
export function SavedToast({ saved }: { saved: boolean }) {
  const pushToast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!saved) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;
    firedRef.current = true;
    pushToast("success", "Saved.");
    router.replace(pathname, { scroll: false });
  }, [saved, pathname, pushToast, router]);

  return null;
}
