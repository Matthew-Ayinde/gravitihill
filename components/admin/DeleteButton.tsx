"use client";

import { Button } from "@/components/ui/Button";

/** A server-action-backed delete with a native confirm — no modal library for one dialog. */
export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="secondary">
        {label}
      </Button>
    </form>
  );
}
