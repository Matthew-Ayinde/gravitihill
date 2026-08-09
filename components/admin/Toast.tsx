"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Admin-only feedback surface. The public site's ContactForm deliberately
 * avoids a toast library ("no toast library, an inline state change"), but
 * /admin is a tool, not a marketing surface, and a save/delete result
 * appearing where the admin is already looking (rather than requiring them
 * to notice a banner above whatever form they just submitted) is the more
 * usable pattern for an internal console. No dependency either way: this is
 * ~60 lines of context + fixed-position stack, not a library.
 */

export type ToastTone = "success" | "error";
type Toast = { id: number; tone: ToastTone; message: string };

const DURATION_MS: Record<ToastTone, number> = { success: 4000, error: 7000 };

const ToastContext = createContext<((tone: ToastTone, message: string) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((tone: ToastTone, message: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, tone, message }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-6 right-6 z-100 flex w-full max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, DURATION_MS[toast.tone]);
    return () => clearTimeout(t);
  }, [toast.tone, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-4 border bg-canvas px-5 py-4",
        toast.tone === "success" ? "border-green/30" : "border-rule",
      )}
    >
      <p
        className={cn(
          "type-eyebrow flex-1",
          toast.tone === "success" ? "text-green" : "text-ink",
        )}
      >
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="type-eyebrow shrink-0 text-ink-muted hover:text-ink"
      >
        ×
      </button>
    </div>
  );
}

/** Throws outside ToastProvider on purpose: every /admin route is wrapped by app/admin/layout.tsx. */
export function useToast() {
  const push = useContext(ToastContext);
  if (!push) throw new Error("useToast must be used within a ToastProvider");
  return push;
}
