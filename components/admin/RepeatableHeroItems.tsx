"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { destroyRemoteVideo } from "@/lib/admin/media-client";
import { HOME_HERO_MAX_ITEMS, type Img } from "@/lib/schemas";

type Row = { id: number; initial?: Img };

/**
 * A repeatable group of hero slides — each row a MediaPicker (still +
 * optional ambient video) submitted as `items.0`, `items.1`, … for
 * lib/admin/form.ts's `getImgList` to read back in order.
 *
 * Rows are keyed by a stable id, not array position, unlike the site's other
 * repeatable-field components (RepeatableIconRows etc.). Those wrap plain
 * `<input defaultValue>` fields with no memory of their own, so index keys
 * are harmless. MediaPicker is different: it holds real state (the selected
 * image, an attached video) that only reads its `initial` prop once, on
 * mount. Keying by position would let React reuse a middle row's picker
 * instance for a different logical slide after another row above it is
 * removed — the label would update, the selected image would not.
 */
export function RepeatableHeroItems({ initial }: { initial: Img[] }) {
  const nextId = useRef(initial.length);
  const [rows, setRows] = useState<Row[]>(initial.map((img, i) => ({ id: i, initial: img })));
  const containers = useRef<Record<number, HTMLLIElement | null>>({});

  function addRow() {
    setRows((r) => [...r, { id: nextId.current++, initial: undefined }]);
  }

  function removeRow(id: number) {
    // A slide's video has no library and no other reuse path (see
    // MediaPicker's own header comment) — read its current value out of the
    // DOM before the row unmounts and destroy it in Cloudinary, the same
    // cleanup MediaPicker's "Remove video" button does for a single slide.
    const mp4 = containers.current[id]?.querySelector<HTMLInputElement>(
      'input[name$=".video.mp4"]',
    )?.value;
    if (mp4) destroyRemoteVideo(mp4);
    setRows((r) => r.filter((row) => row.id !== id));
    delete containers.current[id];
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">
          Slides ({rows.length}/{HOME_HERO_MAX_ITEMS})
        </span>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          disabled={rows.length >= HOME_HERO_MAX_ITEMS}
          onClick={addRow}
        >
          Add a slide
        </Button>
      </div>

      <p className="mb-6 max-w-md text-caption text-ink-muted">
        One slide is a static background. Two or more auto-rotate, crossfading
        every few seconds, disabled entirely under reduced motion, which
        shows only the first slide.
      </p>

      {rows.length === 0 && (
        <p className="border border-dashed border-rule p-5 text-caption text-ink-muted">
          No background set — the hero renders as plain type. Add a slide to
          give it one.
        </p>
      )}

      <ul className="space-y-8">
        {rows.map((row, i) => (
          <li
            key={row.id}
            ref={(el) => {
              containers.current[row.id] = el;
            }}
            className="border border-rule p-5"
          >
            <div className="mb-4 flex items-baseline justify-between">
              <span className="type-eyebrow text-ink-muted">Slide {i + 1}</span>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="type-eyebrow text-ink-muted hover:text-ink"
              >
                Remove slide
              </button>
            </div>
            <MediaPicker field={`items.${i}`} label="Background" initial={row.initial} allowVideo />
          </li>
        ))}
      </ul>
    </div>
  );
}
