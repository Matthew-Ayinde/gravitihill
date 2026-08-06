import { cn } from "@/lib/utils";

export type ActionState = { ok: boolean; message: string } | null;

/**
 * Inline success/error state, same convention as the public ContactForm —
 * no toast library, a real state change rendered in place.
 */
export function StatusBanner({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "type-eyebrow mb-8 border px-5 py-4",
        state.ok
          ? "border-green/30 bg-canvas-alt text-green"
          : "border-rule bg-canvas-alt text-ink",
      )}
    >
      {state.message}
    </p>
  );
}
