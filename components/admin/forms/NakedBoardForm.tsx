"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, FieldGroup } from "@/components/admin/Field";
import { RepeatableStrings } from "@/components/admin/RepeatableStrings";
import { RepeatableIconRows } from "@/components/admin/RepeatableIconRows";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveNakedBoardAction } from "@/app/admin/(dashboard)/naked-board/actions";
import type { NakedBoard } from "@/lib/schemas";

export function NakedBoardForm({ board }: { board?: NakedBoard }) {
  const [state, formAction] = useActionState(saveNakedBoardAction, null);

  const stageRows = (board?.stages ?? []).map((s) => ({ name: s.name, icon: s.icon, note: s.summary }));

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <TextField label="Name" name="name" required defaultValue={board?.name ?? "The Naked Board"} />
      <TextAreaField label="Premise" name="premise" required rows={2} defaultValue={board?.premise} />

      <FieldGroup legend="Positioning">
        <RepeatableStrings name="positioning" label="Positioning paragraphs" initial={board?.positioning ?? [""]} />
      </FieldGroup>

      <FieldGroup legend="The sequence (five stages, run in order)">
        <RepeatableIconRows field="stages" label="Stages" noteLabel="Summary" initial={stageRows} minRows={1} />
      </FieldGroup>

      <FieldGroup legend="Who it is for">
        <RepeatableStrings name="audience" label="Audience situations" initial={board?.audience ?? [""]} />
      </FieldGroup>

      <TextAreaField label="Commitment" name="commitment" required rows={2} defaultValue={board?.commitment} />

      <div className="border-t border-rule pt-8">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
