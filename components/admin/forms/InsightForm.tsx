"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField, FieldGroup } from "@/components/admin/Field";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveInsightAction } from "@/app/admin/(dashboard)/insights/actions";
import { insightCategorySchema, type Insight } from "@/lib/schemas";

const CATEGORIES = insightCategorySchema.options;

export function InsightForm({ insight }: { insight?: Insight }) {
  const action = saveInsightAction.bind(null, insight?.slug);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Title" name="title" required defaultValue={insight?.title} />
        <TextField
          label="Slug"
          name="slug"
          required
          hint="/insights/[slug]"
          defaultValue={insight?.slug}
          pattern="[a-z0-9-]+"
        />
      </div>

      <TextAreaField label="Excerpt" name="excerpt" required rows={2} defaultValue={insight?.excerpt} />

      <div className="grid gap-6 sm:grid-cols-4">
        <SelectField label="Category" name="category" required defaultValue={insight?.category} className="sm:col-span-1">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <TextField label="Author" name="author" required defaultValue={insight?.author ?? "Graviti Hill"} className="sm:col-span-1" />
        <TextField
          label="Published"
          name="publishedAt"
          type="date"
          required
          defaultValue={insight?.publishedAt}
          className="sm:col-span-1"
        />
        <TextField
          label="Reading time (min)"
          name="readingTime"
          type="number"
          min={1}
          required
          defaultValue={insight?.readingTime ?? 5}
          className="sm:col-span-1"
        />
      </div>

      <CheckboxField
        label="Placeholder body — shows a notice on the article and flags it as not yet editorial"
        name="placeholderBody"
        defaultChecked={insight?.placeholderBody ?? true}
      />

      <FieldGroup legend="Cover image">
        <MediaPicker field="coverImage" label="Cover" initial={insight?.coverImage} />
      </FieldGroup>

      <FieldGroup legend="Body">
        <BlockEditor initial={insight?.body ?? []} />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>{insight ? "Save changes" : "Create article"}</SubmitButton>
      </div>
    </form>
  );
}
