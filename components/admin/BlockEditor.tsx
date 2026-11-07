"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import type { ArticleBlock } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type BlockType = ArticleBlock["type"];
/** A block plus a stable key, so reordering never mixes up a row's state. */
type Row = ArticleBlock & { id: string };

const TYPES: { value: BlockType | "ol"; label: string; hint: string }[] = [
  { value: "p", label: "Paragraph", hint: "Body text" },
  { value: "lead", label: "Lead", hint: "Highlighted opening statement" },
  { value: "h2", label: "Section heading", hint: "Numbered; listed in the reading guide" },
  { value: "h3", label: "Sub-heading", hint: "A point within a section, e.g. “1. Fragmented Value Chain”" },
  { value: "quote", label: "Pull quote", hint: "A large display quote" },
  { value: "list", label: "Bullet list", hint: "One item per line" },
  { value: "ol", label: "Numbered list", hint: "One item per line" },
  { value: "image", label: "Image", hint: "Any image, shown whole" },
  { value: "divider", label: "Divider", hint: "A hairline break" },
];

const TEXT_TYPES = ["p", "lead", "h2", "h3", "quote"] as const;
type TextType = (typeof TEXT_TYPES)[number];

let counter = 0;
function newId(): string {
  counter += 1;
  return `b${Date.now().toString(36)}${counter}`;
}

function make(type: BlockType | "ol", text = ""): Row {
  const id = newId();
  switch (type) {
    case "list":
    case "ol":
      return { id, type: "list", items: text ? text.split("\n") : [""], ordered: type === "ol" };
    case "image":
      return { id, type: "image", alt: "", size: "wide" };
    case "divider":
      return { id, type: "divider" };
    case "quote":
      return { id, type: "quote", text };
    default:
      return { id, type, text };
  }
}

function label(row: Row): string {
  if (row.type === "list") return row.ordered ? "Numbered list" : "Bullet list";
  return TYPES.find((t) => t.value === row.type)?.label ?? row.type;
}

function textOf(row: Row): string {
  if ("text" in row) return row.text;
  if (row.type === "list") return row.items.join("\n");
  return "";
}

/**
 * The article body editor: an ordered stack of typed blocks that mirrors
 * `articleBlockSchema` exactly, so what an editor builds here is what the
 * article renders — no WYSIWYG library, no HTML stored.
 *
 * Any block can be added anywhere (the + rows between blocks), moved,
 * duplicated, converted to another text type or removed. Text blocks take
 * **bold**, *italic* and [links](https://…) through the toolbar. Image
 * blocks use the shared media library; an image block left empty is kept as
 * a slot and renders nothing on the site until an image is chosen.
 *
 * Unlike the other repeatable groups, the whole body submits as one JSON
 * field (`body`): blocks are heterogeneous — an image block alone carries
 * a nested object — so parallel arrays zipped by index would be fragile.
 * The server action validates it against the same schema.
 */
export function BlockEditor({ initial }: { initial: ArticleBlock[] }) {
  const [rows, setRows] = useState<Row[]>(() =>
    (initial.length > 0 ? initial : [{ type: "p" as const, text: "" }]).map((b) => ({ ...b, id: newId() })),
  );
  const [importing, setImporting] = useState(false);

  function update(id: string, patch: (row: Row) => Row) {
    setRows((r) => r.map((row) => (row.id === id ? patch(row) : row)));
  }

  function insertAt(index: number, row: Row | Row[]) {
    setRows((r) => [...r.slice(0, index), ...(Array.isArray(row) ? row : [row]), ...r.slice(index)]);
  }

  function move(index: number, by: -1 | 1) {
    setRows((r) => {
      const to = index + by;
      if (to < 0 || to >= r.length) return r;
      const next = [...r];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }

  function convert(row: Row, type: BlockType | "ol"): Row {
    const text = textOf(row);
    if (type === "list" || type === "ol") {
      return { ...make(type, text), id: row.id };
    }
    if ((TEXT_TYPES as readonly string[]).includes(type)) {
      // Lists collapse to one line per item, joined by spaces.
      return { ...make(type, row.type === "list" ? row.items.join(" ") : text), id: row.id };
    }
    return { ...make(type), id: row.id };
  }

  // Strip editor keys; the server trims and validates.
  const serialised = JSON.stringify(rows.map(({ id: _id, ...block }) => block));

  return (
    <div>
      <input type="hidden" name="body" value={serialised} />

      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <p className="max-w-xl text-caption text-ink-muted">
          Build the article from blocks, in reading order. Use the{" "}
          <span className="text-ink">+</span> rows to add a block anywhere. Text supports{" "}
          <code className="text-ink">**bold**</code>, <code className="text-ink">*italic*</code> and{" "}
          <code className="text-ink">[link](https://…)</code>.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-caption"
          onClick={() => setImporting((v) => !v)}
        >
          {importing ? "Close import" : "Import text"}
        </Button>
      </div>

      {importing && (
        <ImportPanel
          onImport={(blocks) => {
            setRows((r) => {
              // Replace a lone empty starter paragraph rather than appending after it.
              const empty = r.length === 1 && r[0].type === "p" && !r[0].text.trim();
              return empty ? blocks : [...r, ...blocks];
            });
            setImporting(false);
          }}
        />
      )}

      <Inserter onPick={(type) => insertAt(0, make(type))} />
      <ol className="space-y-0">
        {rows.map((row, i) => (
          <li key={row.id}>
            <div className="border border-rule bg-canvas">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule bg-canvas-alt px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="type-eyebrow tabular-nums text-ink-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <select
                    aria-label={`Block ${i + 1} type`}
                    value={row.type === "list" && row.ordered ? "ol" : row.type}
                    onChange={(e) => update(row.id, (r) => convert(r, e.target.value as BlockType | "ol"))}
                    className="rounded-sm border border-rule bg-canvas px-2 py-1 text-caption"
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton label={`Move block ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                    ↑
                  </IconButton>
                  <IconButton
                    label={`Move block ${i + 1} down`}
                    disabled={i === rows.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </IconButton>
                  <IconButton
                    label={`Duplicate block ${i + 1}`}
                    onClick={() => insertAt(i + 1, { ...structuredClone(row), id: newId() })}
                  >
                    Copy
                  </IconButton>
                  <IconButton
                    label={`Remove block ${i + 1}`}
                    onClick={() => setRows((r) => r.filter((x) => x.id !== row.id))}
                  >
                    Remove
                  </IconButton>
                </div>
              </div>

              <div className="p-4">
                <BlockFields row={row} onChange={(next) => update(row.id, () => next)} />
              </div>
            </div>
            <Inserter onPick={(type) => insertAt(i + 1, make(type))} />
          </li>
        ))}
      </ol>
      {rows.length === 0 && (
        <p className="py-6 text-caption text-ink-muted">No blocks yet. Use + to add the first one.</p>
      )}
    </div>
  );
}

/* ── One block's fields ──────────────────────────────────────────────────── */

function BlockFields({ row, onChange }: { row: Row; onChange: (row: Row) => void }) {
  switch (row.type) {
    case "list":
      return (
        <RichText
          value={row.items.join("\n")}
          onChange={(v) => onChange({ ...row, items: v.split("\n") })}
          rows={Math.max(3, row.items.length + 1)}
          placeholder="One item per line"
          ariaLabel={row.ordered ? "Numbered list items" : "Bullet list items"}
        />
      );

    case "image":
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <MediaPicker
            label="Image"
            initial={row.image}
            onChange={(image) =>
              onChange({ ...row, image, alt: row.alt || image?.alt || "" })
            }
          />
          <div className="space-y-5">
            <SmallField label="Alt text" hint="Describe the image for screen readers">
              {(id) => (
                <input
                  id={id}
                  value={row.alt}
                  onChange={(e) => onChange({ ...row, alt: e.target.value })}
                  onKeyDown={preventSubmit}
                  className={INPUT}
                />
              )}
            </SmallField>
            <SmallField label="Caption" hint="Optional. Shown beneath the image">
              {(id) => (
                <input
                  id={id}
                  value={row.caption ?? ""}
                  onChange={(e) => onChange({ ...row, caption: e.target.value || undefined })}
                  onKeyDown={preventSubmit}
                  className={INPUT}
                />
              )}
            </SmallField>
            <SmallField label="Width">
              {(id) => (
                <select
                  id={id}
                  value={row.size}
                  onChange={(e) => onChange({ ...row, size: e.target.value as "column" | "wide" })}
                  className={INPUT}
                >
                  <option value="wide">Wide — full body column (charts, infographics)</option>
                  <option value="column">Column — same width as the text</option>
                </select>
              )}
            </SmallField>
            <p className="text-caption text-ink-muted">
              The image is always shown whole at its own proportions — never cropped.
              {!row.image && " Until an image is chosen this block is a slot and shows nothing on the site."}
            </p>
          </div>
        </div>
      );

    case "divider":
      return <p className="text-caption text-ink-muted">A hairline break between movements of the piece.</p>;

    case "quote":
      return (
        <div className="space-y-4">
          <RichText
            value={row.text}
            onChange={(text) => onChange({ ...row, text })}
            rows={2}
            placeholder="Quote text"
            ariaLabel="Quote text"
            toolbar={false}
          />
          <SmallField label="Attribution" hint="Optional">
            {(id) => (
              <input
                id={id}
                value={row.cite ?? ""}
                onChange={(e) => onChange({ ...row, cite: e.target.value || undefined })}
                onKeyDown={preventSubmit}
                className={INPUT}
              />
            )}
          </SmallField>
        </div>
      );

    default: {
      const type = row.type as TextType;
      const heading = type === "h2" || type === "h3";
      return (
        <RichText
          value={row.text}
          onChange={(text) => onChange({ ...row, text })}
          rows={heading ? 1 : 4}
          placeholder={TYPES.find((t) => t.value === type)?.hint ?? ""}
          ariaLabel={label(row)}
          toolbar={!heading}
          className={cn(
            heading && "type-subhead text-body-lg",
            type === "lead" && "font-medium italic",
          )}
        />
      );
    }
  }
}

/* ── Text with a formatting toolbar ─────────────────────────────────────── */

function RichText({
  value,
  onChange,
  rows,
  placeholder,
  ariaLabel,
  toolbar = true,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder: string;
  ariaLabel: string;
  toolbar?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  /** Wraps the selection in markers (or inserts them around a placeholder word). */
  function wrap(before: string, after: string, fallback: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const chosen = value.slice(start, end) || fallback;
    onChange(value.slice(0, start) + before + chosen + after + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + chosen.length);
    });
  }

  function link() {
    const url = window.prompt("Link address (https://…, mailto:…, or /a-page-on-this-site)");
    if (!url) return;
    wrap("[", `](${url.trim()})`, "link text");
  }

  return (
    <div>
      {toolbar && (
        <div className="mb-2 flex gap-1">
          <IconButton label="Bold" onClick={() => wrap("**", "**", "bold text")}>
            <strong>B</strong>
          </IconButton>
          <IconButton label="Italic" onClick={() => wrap("*", "*", "italic text")}>
            <em>I</em>
          </IconButton>
          <IconButton label="Link" onClick={link}>
            Link
          </IconButton>
        </div>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(INPUT, "field-sizing-content resize-y", className)}
      />
    </div>
  );
}

/* ── Insert a block between rows ─────────────────────────────────────────── */

function Inserter({ onPick }: { onPick: (type: BlockType | "ol") => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative py-2">
      {open ? (
        <div className="flex flex-wrap items-center gap-2 border border-dashed border-green bg-canvas p-3">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              title={t.hint}
              onClick={() => {
                onPick(t.value);
                setOpen(false);
              }}
              className="rounded-sm border border-rule px-3 py-1.5 text-caption hover:border-green hover:bg-canvas-alt"
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto px-2 py-1.5 text-caption text-ink-muted hover:text-ink"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 text-caption text-ink-muted opacity-60 transition-opacity hover:text-green hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="h-px flex-1 bg-rule" />
          <span className="rounded-sm border border-rule bg-canvas px-2.5 py-0.5">+ Add block</span>
          <span className="h-px flex-1 bg-rule" />
        </button>
      )}
    </div>
  );
}

/* ── Paste a whole article in ────────────────────────────────────────────── */

/**
 * Turns pasted text into blocks. Blank lines separate blocks; a few
 * markdown-style prefixes pick the type:
 *
 *   ## Heading      section heading       > text       pull quote
 *   ### Sub-head    sub-heading           - item       bullet list
 *   ! text          lead                  1. item      numbered list
 *   ---             divider
 *
 * Anything else becomes a paragraph. Bold, italic and links pass through.
 */
export function parseImport(text: string): Row[] {
  const chunks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
  return chunks.map((chunk) => {
    const lines = chunk.split("\n").map((l) => l.trim());
    if (/^-{3,}$/.test(chunk)) return make("divider");
    if (chunk.startsWith("### ")) return make("h3", chunk.slice(4).trim());
    if (chunk.startsWith("## ")) return make("h2", chunk.slice(3).trim());
    if (chunk.startsWith("> ")) return make("quote", lines.map((l) => l.replace(/^>\s?/, "")).join(" "));
    if (chunk.startsWith("! ")) return make("lead", lines.join(" ").slice(2).trim());
    if (lines.every((l) => /^[-•*]\s+/.test(l))) {
      return make("list", lines.map((l) => l.replace(/^[-•*]\s+/, "")).join("\n"));
    }
    if (lines.length > 1 && lines.every((l) => /^\d+[.)]\s+/.test(l))) {
      return make("ol", lines.map((l) => l.replace(/^\d+[.)]\s+/, "")).join("\n"));
    }
    return make("p", lines.join(" "));
  });
}

function ImportPanel({ onImport }: { onImport: (rows: Row[]) => void }) {
  const [text, setText] = useState("");
  const preview = text.trim() ? parseImport(text) : [];

  return (
    <div className="mb-6 border border-rule bg-canvas-alt p-4">
      <p className="mb-3 text-caption text-ink-muted">
        Paste text — blocks are separated by a blank line. Start a block with{" "}
        <code className="text-ink">## </code> for a section heading,{" "}
        <code className="text-ink">### </code> for a sub-heading,{" "}
        <code className="text-ink">! </code> for the lead, <code className="text-ink">&gt; </code> for a
        pull quote, <code className="text-ink">- </code> or <code className="text-ink">1. </code> on every
        line for a list, or <code className="text-ink">---</code> for a divider. Everything else becomes a
        paragraph. The blocks are added to the end of the article.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        aria-label="Text to import"
        className={cn(INPUT, "resize-y")}
      />
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-caption text-ink-muted">
          {preview.length > 0 ? `${preview.length} block${preview.length === 1 ? "" : "s"}` : ""}
        </span>
        <Button
          type="button"
          className="px-4 py-2 text-caption"
          disabled={preview.length === 0}
          onClick={() => onImport(preview)}
        >
          Add blocks
        </Button>
      </div>
    </div>
  );
}

/* ── Small parts ─────────────────────────────────────────────────────────── */

const INPUT = "w-full rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body";

function preventSubmit(e: KeyboardEvent) {
  // A plain input inside a <form> submits on Enter — not wanted mid-edit.
  if (e.key === "Enter") e.preventDefault();
}

function IconButton({
  label: name,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={name}
      title={name}
      onClick={onClick}
      disabled={disabled}
      className="min-w-8 rounded-sm border border-rule bg-canvas px-2 py-1 text-caption text-ink hover:border-green disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SmallField({
  label: name,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="type-eyebrow mb-2 block text-ink-muted">
        {name}
        {hint && <span className="ml-2 normal-case tracking-normal text-ink-muted/80">{hint}</span>}
      </label>
      {children(id)}
    </div>
  );
}
