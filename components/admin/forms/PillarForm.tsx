"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/admin/Field";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { savePillarAction } from "@/app/admin/(dashboard)/dna/actions";
import { iconNameSchema, type Pillar } from "@/lib/schemas";

const ICONS = iconNameSchema.options;

export function PillarForm({
  pillar,
  slug,
  order,
}: {
  pillar?: Pillar;
  slug?: string;
  order: number;
}) {
  const action = savePillarAction.bind(null, slug);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-3">
        <TextField label="Name" name="name" required defaultValue={pillar?.name} className="sm:col-span-2" />
        <TextField label="Position" name="order" type="number" required defaultValue={order} />
      </div>

      <SelectField label="Icon" name="icon" required defaultValue={pillar?.icon}>
        {ICONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </SelectField>

      <TextAreaField label="Summary" name="summary" required rows={2} hint="One line, sits under the name" defaultValue={pillar?.summary} />
      <TextAreaField label="Detail" name="detail" required rows={4} defaultValue={pillar?.detail} />

      <div className="border-t border-rule pt-8">
        <SubmitButton>{pillar ? "Save changes" : "Add pillar"}</SubmitButton>
      </div>
    </form>
  );
}
