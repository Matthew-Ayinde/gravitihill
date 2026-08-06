"use client";

import { useActionState } from "react";
import { TextField, FieldGroup } from "@/components/admin/Field";
import { RepeatablePhones } from "@/components/admin/RepeatablePhones";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSettingsAction } from "@/app/admin/(dashboard)/settings/actions";
import type { Settings } from "@/lib/schemas";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(saveSettingsAction, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <FieldGroup legend="Address">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Street" name="street" required defaultValue={settings.address.street} className="sm:col-span-2" />
          <TextField label="Locality" name="locality" required defaultValue={settings.address.locality} />
          <TextField label="Region" name="region" required defaultValue={settings.address.region} />
          <TextField label="Country" name="country" required defaultValue={settings.address.country} />
          <TextField label="Country code" name="countryCode" required hint="ISO 3166-1 alpha-2, e.g. NG" defaultValue={settings.address.countryCode} />
        </div>
      </FieldGroup>

      <FieldGroup legend="Contact">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField label="Email" name="email" type="email" required defaultValue={settings.email} />
          <TextField label="LinkedIn" name="linkedin" type="url" required defaultValue={settings.linkedin} />
        </div>
      </FieldGroup>

      <FieldGroup legend="Phones">
        <RepeatablePhones initial={[...settings.phones]} />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
