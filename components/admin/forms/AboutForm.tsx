"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, FieldGroup } from "@/components/admin/Field";
import { RepeatableOriginBlocks } from "@/components/admin/RepeatableOriginBlocks";
import { RepeatableFacts } from "@/components/admin/RepeatableFacts";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveAboutAction } from "@/app/admin/(dashboard)/about/actions";
import type { About } from "@/lib/schemas";

export function AboutForm({ about }: { about?: About }) {
  const [state, formAction] = useActionState(saveAboutAction, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <TextField label="Positioning" name="positioning" required defaultValue={about?.positioning} />
      <TextAreaField label="Purpose" name="purpose" required rows={2} defaultValue={about?.purpose} />
      <TextAreaField label="Précis" name="precis" required rows={3} defaultValue={about?.precis} />
      <TextAreaField label="Pull-quote" name="pullQuote" required rows={2} defaultValue={about?.pullQuote} />

      <FieldGroup legend="Origin story">
        <RepeatableOriginBlocks initial={about?.origin ?? []} />
      </FieldGroup>

      <FieldGroup legend="Facts (hero margin)">
        <RepeatableFacts initial={about?.facts ?? []} />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
