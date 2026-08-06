"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, FieldGroup, CheckboxField } from "@/components/admin/Field";
import { RepeatableStrings } from "@/components/admin/RepeatableStrings";
import { RepeatableIconRows } from "@/components/admin/RepeatableIconRows";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { savePracticeAction } from "@/app/admin/(dashboard)/services/actions";
import type { Practice, Sector } from "@/lib/schemas";

export function PracticeForm({
  practice,
  sectorOptions,
}: {
  practice?: Practice;
  sectorOptions: Sector[];
}) {
  const action = savePracticeAction.bind(null, practice?.slug);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={practice?.name} />
        <TextField
          label="Slug"
          name="slug"
          required
          hint="Used in the URL — /services/[slug]"
          defaultValue={practice?.slug}
          pattern="[a-z0-9-]+"
        />
      </div>

      <TextAreaField
        label="Proposition"
        name="proposition"
        required
        rows={2}
        hint="Two lines maximum"
        defaultValue={practice?.proposition}
      />

      <FieldGroup legend="The argument">
        <RepeatableStrings
          name="thesis"
          label="Thesis (3–5 sentences, one per row)"
          initial={practice?.thesis ?? ["", ""]}
          minRows={2}
        />
      </FieldGroup>

      <FieldGroup legend="Services">
        <RepeatableIconRows
          field="offerings"
          label="Offerings (at least 3)"
          noteLabel="One declarative sentence"
          initial={practice?.offerings ?? []}
          minRows={3}
        />
      </FieldGroup>

      <FieldGroup legend="Cover image">
        <MediaPicker field="cover" label="Cover" initial={practice?.cover} />
      </FieldGroup>

      <FieldGroup legend="Cross-links">
        <span className="type-eyebrow mb-3 block text-ink-muted">Related sectors</span>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {sectorOptions.map((sector) => (
            <CheckboxField
              key={sector.slug}
              name="relatedSectors"
              value={sector.slug}
              label={sector.name}
              defaultChecked={practice?.relatedSectors.includes(sector.slug)}
            />
          ))}
        </div>

        <TextField
          className="mt-8"
          label="Platform link (Executive Coaching only)"
          name="platformHref"
          hint="e.g. /the-naked-board"
          defaultValue={practice?.platformHref}
        />
      </FieldGroup>

      <div className="flex items-center gap-4 border-t border-rule pt-8">
        <SubmitButton>{practice ? "Save changes" : "Create practice"}</SubmitButton>
      </div>
    </form>
  );
}
