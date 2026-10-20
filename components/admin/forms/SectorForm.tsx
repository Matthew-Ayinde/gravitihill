"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, FieldGroup, CheckboxField } from "@/components/admin/Field";
import { RepeatableStrings } from "@/components/admin/RepeatableStrings";
import { RepeatableIconRows } from "@/components/admin/RepeatableIconRows";
import { RepeatableNoteRows } from "@/components/admin/RepeatableNoteRows";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSectorAction } from "@/app/admin/(dashboard)/sectors/actions";
import type { Sector } from "@/lib/schemas";

export function SectorForm({ sector, order }: { sector?: Sector; order: number }) {
  const action = saveSectorAction.bind(null, sector?.slug);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-3">
        <TextField label="Name" name="name" required defaultValue={sector?.name} className="sm:col-span-1" />
        <TextField
          label="Slug"
          name="slug"
          required
          hint="/sectors/[slug]"
          defaultValue={sector?.slug}
          pattern="[a-z0-9-]+"
          className="sm:col-span-1"
        />
        <TextField
          label="Position"
          name="order"
          type="number"
          required
          hint="0-indexed — sets the panel sequence"
          defaultValue={order}
          className="sm:col-span-1"
        />
      </div>

      <TextAreaField
        label="Proposition"
        name="proposition"
        required
        rows={2}
        hint="Carries the sector at display scale"
        defaultValue={sector?.proposition}
      />

      <FieldGroup legend="Thesis">
        <RepeatableStrings name="thesis" label="Thesis" initial={sector?.thesis ?? [""]} />
      </FieldGroup>

      <FieldGroup legend="Our point of view (headed points; leave empty to use thesis 2+)">
        <RepeatableNoteRows field="position" label="Points" initial={sector?.position ?? []} />
      </FieldGroup>

      <FieldGroup legend="Strategic approach (2 or 3)">
        <RepeatableIconRows
          field="approach"
          label="Approach"
          noteLabel="Note"
          initial={sector?.approach ?? []}
          minRows={2}
        />
      </FieldGroup>

      <FieldGroup legend="What makes us different">
        <RepeatableNoteRows field="differentiators" label="Differentiators" initial={sector?.differentiators ?? []} />
      </FieldGroup>

      <FieldGroup legend="Page overrides (optional; leave empty for the shared defaults)">
        <div className="space-y-6">
          <RepeatableStrings name="panelPoints" label="Sectors panel bullets (default: approach names)" initial={sector?.panelPoints ?? []} />
          <TextField label="Approach heading" name="approachHeading" hint="Default: How we deliver it." defaultValue={sector?.approachHeading} />
          <TextField label="Difference heading" name="differenceHeading" hint="Default: What makes us different here." defaultValue={sector?.differenceHeading} />
          <RepeatableStrings name="differencePoints" label="Difference points (replace the cards when set)" initial={sector?.differencePoints ?? []} />
          <TextField label="Practices heading" name="practicesHeading" hint="Default: What we bring to … work." defaultValue={sector?.practicesHeading} />
          <CheckboxField label="Hide practices section" name="hidePractices" defaultChecked={sector?.hidePractices} />
          <RepeatableNoteRows field="practiceNotes" label="Practice lines (name = practice slug, e.g. business-advisory)" initial={sector?.practiceNotes ?? []} />
          <TextField label="Closing heading" name="ctaHeading" hint="Default: Talk to us about …" defaultValue={sector?.ctaHeading} />
          <TextAreaField label="Closing paragraph" name="ctaBody" rows={2} defaultValue={sector?.ctaBody} />
          <TextField label="Closing label" name="ctaLabel" hint="Shown above the contact routes" defaultValue={sector?.ctaLabel} />
        </div>
      </FieldGroup>

      <FieldGroup legend="Image">
        <MediaPicker field="image" label="Sector image" initial={sector?.image} />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>{sector ? "Save changes" : "Create sector"}</SubmitButton>
      </div>
    </form>
  );
}
