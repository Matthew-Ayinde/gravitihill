"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type OriginBlock = { heading: string; body: string[] };

/**
 * The /about origin story — a small number of {heading, body[]} blocks. Two
 * nesting levels, so encoded as three parallel fields: `origin.heading` (one
 * per block) and `origin.bodyIndex` + `origin.bodyText` (one pair per
 * paragraph, `bodyIndex` naming which block the paragraph belongs to). The
 * server action groups `bodyText` entries by their matching `bodyIndex`.
 */
export function RepeatableOriginBlocks({ initial }: { initial: OriginBlock[] }) {
  const [blocks, setBlocks] = useState<OriginBlock[]>(
    initial.length > 0 ? initial : [{ heading: "", body: [""] }],
  );

  function updateHeading(i: number, heading: string) {
    setBlocks((b) => b.map((block, idx) => (idx === i ? { ...block, heading } : block)));
  }

  function updateParagraph(blockIndex: number, paraIndex: number, text: string) {
    setBlocks((b) =>
      b.map((block, idx) =>
        idx !== blockIndex
          ? block
          : { ...block, body: block.body.map((p, pIdx) => (pIdx === paraIndex ? text : p)) },
      ),
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">Origin blocks</span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setBlocks((b) => [...b, { heading: "", body: [""] }])}
        >
          Add block
        </Button>
      </div>

      <ul className="space-y-8">
        {blocks.map((block, i) => (
          <li key={i} className="border border-rule p-5">
            <div className="mb-4 flex items-center gap-3">
              <input
                name="origin.heading"
                value={block.heading}
                onChange={(e) => updateHeading(i, e.target.value)}
                placeholder="Heading"
                className="flex-1 rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
              />
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2.5 text-caption"
                disabled={blocks.length <= 1}
                onClick={() => setBlocks((b) => b.filter((_, idx) => idx !== i))}
              >
                Remove block
              </Button>
            </div>

            <ul className="space-y-2">
              {block.body.map((paragraph, pIdx) => (
                <li key={pIdx} className="flex gap-2">
                  <input type="hidden" name="origin.bodyIndex" value={i} />
                  <textarea
                    name="origin.bodyText"
                    value={paragraph}
                    onChange={(e) => updateParagraph(i, pIdx, e.target.value)}
                    rows={2}
                    placeholder="Paragraph"
                    className="w-full resize-y rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-fit shrink-0 px-3 py-2.5 text-caption"
                    disabled={block.body.length <= 1}
                    onClick={() =>
                      setBlocks((b) =>
                        b.map((bl, idx) =>
                          idx !== i ? bl : { ...bl, body: bl.body.filter((_, j) => j !== pIdx) },
                        ),
                      )
                    }
                  >
                    ×
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 px-3 py-1.5 text-caption"
              onClick={() =>
                setBlocks((b) => b.map((bl, idx) => (idx !== i ? bl : { ...bl, body: [...bl.body, ""] })))
              }
            >
              Add paragraph
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
