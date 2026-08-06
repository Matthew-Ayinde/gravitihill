"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Phone = { display: string; e164: string; whatsapp: boolean };

/** Display order matters — the first phone flagged `whatsapp` is the WhatsApp deeplink number. */
export function RepeatablePhones({ initial }: { initial: Phone[] }) {
  const [rows, setRows] = useState<Phone[]>(
    initial.length > 0 ? initial : [{ display: "", e164: "", whatsapp: true }],
  );

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">Phone numbers</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, { display: "", e164: "", whatsapp: false }])}
        >
          Add
        </Button>
      </div>
      <ul className="space-y-3">
        {rows.map((row, i) => (
          <li key={i} className="grid grid-cols-1 gap-3 border border-rule p-4 sm:grid-cols-12 sm:items-center">
            <input
              name="phones.display"
              defaultValue={row.display}
              placeholder="0802 224 2156"
              className="rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-4"
            />
            <input
              name="phones.e164"
              defaultValue={row.e164}
              placeholder="+2348022242156"
              className="rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body sm:col-span-4"
            />
            <label className="flex items-center gap-2 sm:col-span-3">
              <input
                type="checkbox"
                name="phones.whatsapp"
                value={String(i)}
                defaultChecked={row.whatsapp}
                className="h-4 w-4 rounded-sm border border-rule accent-green"
              />
              <span className="type-eyebrow text-ink-muted">WhatsApp</span>
            </label>
            <Button
              type="button"
              variant="secondary"
              className="px-3 py-2.5 text-caption sm:col-span-1"
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
