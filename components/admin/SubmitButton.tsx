"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Reuses the site's own Button — pending state shifts to a muted label, no spinner. */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary";
  tone?: "light" | "dark";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      tone={tone}
      disabled={pending}
      className={cn(className)}
      aria-busy={pending}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
