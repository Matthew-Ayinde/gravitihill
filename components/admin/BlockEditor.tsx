"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Insight } from "@/lib/schemas";

type Block = Insight["body"][number];
type BlockType = Block["type"];

const TYPES: { value: BlockType; label: string }[] = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading" },
  { value: "quote", label: "Quote" },
  { value: "list", label: "List" },
];

function blockText(block: Block): string {
  return block.type === "list" ? "" : block.text;
}

function blockItems(block: Block): string {
  return block.type === "list" ? block.items.join("\n") : "";
}

/**
 * Matches insightSchema's typed block union exactly — no rich-text/WYSIWYG
 * library, since the schema is explicitly "MDX-ready... paragraph strings
 * today." Three parallel fields per row (`body.type`, `body.text`,
 * `body.items`) zip back together by index on the server, same convention as
 * the other repeatable groups: removing a row removes all three at once.
 */
export function BlockEditor({ initial }: { initial: Block[] }) {
  const [rows, setRows] = useState<Block[]>(
    initial.length > 0 ? initial : [{ type: "p", text: "" }],
  );

  function updateType(i: number, type: BlockType) {
    setRows((r) =>
      r.map((row, idx) =>
        idx !== i
          ? row
          : type === "list"
            ? { type: "list", items: blockItems(row) ? blockItems(row).split("\n") : [""] }
            : { type, text: blockText(row) },
      ),
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">Body</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setRows((r) => [...r, { type: "p", text: "" }])}
        >
          Add block
        </Button>
      </div>
      <ul className="space-y-4">
        {rows.map((row, i) => (
          <li key={i} className="border border-rule p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <select
                name="body.type"
                value={row.type}
                onChange={(e) => updateType(i, e.target.value as BlockType)}
                className="rounded-sm border border-rule bg-canvas px-3 py-2 text-body"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2 text-caption"
                disabled={rows.length <= 1}
                onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}
              >
                Remove block
              </Button>
            </div>

            {row.type === "list" ? (
              <textarea
                name="body.items"
                defaultValue={blockItems(row)}
                rows={4}
                placeholder="One list item per line"
                className="w-full resize-y rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
              />
            ) : (
              <textarea
                name="body.text"
                defaultValue={blockText(row)}
                rows={row.type === "h2" ? 1 : 3}
                placeholder={row.type === "h2" ? "Heading text" : row.type === "quote" ? "Quote text" : "Paragraph text"}
                className="w-full resize-y rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
              />
            )}
            {/* Keeps the three parallel arrays aligned even when a row's inactive field is empty. */}
            {row.type !== "list" && <input type="hidden" name="body.items" value="" />}
            {row.type === "list" && <input type="hidden" name="body.text" value="" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
