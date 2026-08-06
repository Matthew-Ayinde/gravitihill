"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { iconNameSchema } from "@/lib/schemas";

const ICONS = iconNameSchema.options;

export type IconRow = { name: string; icon: string; note: string };

/**
 * A repeatable group of {name, icon, note} rows — offerings, approach steps,
 * Naked Board stages (where `note` maps to `summary` in the adapter that
 * reads the submitted FormData). Each field in a row shares one name across
 * all rows (`${field}.name`, `${field}.icon`, `${field}.note`); the server
 * action zips the three parallel arrays back together by index, which stays
 * safe because removing a row removes all three inputs for it at once.
 */
export function RepeatableIconRows({
  field,
  label,
  noteLabel,
  initial,
  minRows = 1,
}: {
  field: string;
  label: string;
  noteLabel: string;
  initial: IconRow[];
  minRows?: number;
}) {
  const [rows, setRows] = useState<IconRow[]>(
    initial.length > 0 ? initial : [{ name: "", icon: ICONS[0], note: "" }],
  );

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">{label}</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, { name: "", icon: ICONS[0], note: "" }])}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-6">
        {rows.map((row, i) => (
          <li key={i} className="grid grid-cols-1 gap-3 border border-rule p-4 sm:grid-cols-12">
            <input
              name={`${field}.name`}
              defaultValue={row.name}
              placeholder="Name"
              className="rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-4"
            />
            <select
              name={`${field}.icon`}
              defaultValue={row.icon}
              className="rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-3"
            >
              {ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <textarea
              name={`${field}.note`}
              defaultValue={row.note}
              rows={2}
              placeholder={noteLabel}
              className="resize-y rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-4"
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
