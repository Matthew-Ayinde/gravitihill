"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Fact = { label: string; value: string };

/** {label, value} pairs — the /about hero-margin facts (Founded, Base, Leadership). */
export function RepeatableFacts({ initial }: { initial: Fact[] }) {
  const [rows, setRows] = useState<Fact[]>(initial.length > 0 ? initial : [{ label: "", value: "" }]);

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">Facts</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, { label: "", value: "" }])}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="flex gap-3">
            <input
              name="facts.label"
              defaultValue={row.label}
              placeholder="Label"
              className="w-1/2 rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
            />
            <input
              name="facts.value"
              defaultValue={row.value}
              placeholder="Value"
              className="w-1/2 rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 px-3 py-2.5 text-caption"
              disabled={rows.length <= 1}
              onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
