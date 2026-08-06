"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * A repeatable list of plain-text lines — thesis paragraphs, audience items,
 * positioning paragraphs, list items. All rows share one `name`, so
 * `formData.getAll(name)` on the server reconstructs the array in DOM order —
 * no JSON encoding, no client/server shape drift.
 */
export function RepeatableStrings({
  name,
  label,
  initial,
  minRows = 1,
  placeholder,
}: {
  name: string;
  label: string;
  initial: string[];
  minRows?: number;
  placeholder?: string;
}) {
  const [rows, setRows] = useState(initial.length > 0 ? initial : [""]);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">{label}</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, ""])}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-3">
        {rows.map((value, i) => (
          <li key={i} className="flex gap-3">
            <textarea
              name={name}
              defaultValue={value}
              rows={2}
              placeholder={placeholder}
              className="w-full resize-y rounded-sm border border-rule bg-canvas px-4 py-3 text-body text-ink focus-visible:border-green"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-fit shrink-0 px-3 py-3 text-caption"
              disabled={rows.length <= minRows}
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${label} row ${i + 1}`}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
