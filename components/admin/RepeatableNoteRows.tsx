"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export type NoteRow = { name: string; note: string };

/** {name, note} rows with no icon — sector differentiators. Same zip-by-index convention as RepeatableIconRows. */
export function RepeatableNoteRows({
  field,
  label,
  initial,
  minRows = 1,
}: {
  field: string;
  label: string;
  initial: NoteRow[];
  minRows?: number;
}) {
  const [rows, setRows] = useState<NoteRow[]>(initial.length > 0 ? initial : [{ name: "", note: "" }]);

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">{label}</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, { name: "", note: "" }])}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-4">
        {rows.map((row, i) => (
          <li key={i} className="grid grid-cols-1 gap-3 border border-rule p-4 sm:grid-cols-12">
            <input
              name={`${field}.name`}
              defaultValue={row.name}
              placeholder="Name"
              className="rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-4"
            />
            <textarea
              name={`${field}.note`}
              defaultValue={row.note}
              rows={2}
              placeholder="Note"
              className="resize-y rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-7"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-fit px-3 py-2.5 text-caption sm:col-span-1"
              disabled={rows.length <= minRows}
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${label} row ${i + 1}`}
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
