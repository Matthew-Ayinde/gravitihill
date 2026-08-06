"use client";

import { useActionState } from "react";
import { TextField, FieldGroup } from "@/components/admin/Field";
import { RepeatableStrings } from "@/components/admin/RepeatableStrings";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { savePersonAction } from "@/app/admin/(dashboard)/team/actions";
import type { Person } from "@/lib/schemas";

export function PersonForm({ person, order }: { person?: Person; order: number }) {
  const action = savePersonAction.bind(null, person?.slug);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={person?.name} />
        <TextField
          label="Slug"
          name="slug"
          required
          hint="Used in Person JSON-LD"
          defaultValue={person?.slug}
          pattern="[a-z0-9-]+"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <TextField label="Role" name="role" required defaultValue={person?.role} className="sm:col-span-2" />
        <TextField label="Position" name="order" type="number" required defaultValue={order} />
      </div>

      <FieldGroup legend="Biography">
        <RepeatableStrings name="bio" label="Bio (rendered as prose paragraphs)" initial={person?.bio ?? [""]} />
      </FieldGroup>

      <FieldGroup legend="Credentials">
        <RepeatableStrings name="credentials" label="Credentials" initial={person?.credentials ?? []} minRows={0} />
      </FieldGroup>

      <TextField
        label="LinkedIn"
        name="linkedin"
        type="url"
        placeholder="https://www.linkedin.com/in/…"
        defaultValue={person?.linkedin}
      />

      <FieldGroup legend="Photo">
        <MediaPicker field="photo" label="Portrait — renders a monogram when absent" initial={person?.photo} />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>{person ? "Save changes" : "Add leader"}</SubmitButton>
      </div>
    </form>
  );
}
