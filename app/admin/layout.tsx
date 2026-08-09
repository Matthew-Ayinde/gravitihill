import type { ReactNode } from "react";
import { ToastProvider } from "@/components/admin/Toast";

/**
 * Wraps every /admin route — login included, not just the authenticated
 * (dashboard) group — so StatusBanner has a ToastProvider to push into
 * wherever it's used.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
