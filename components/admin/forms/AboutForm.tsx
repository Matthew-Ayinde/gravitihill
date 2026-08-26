"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, FieldGroup } from "@/components/admin/Field";
import { RepeatableOriginBlocks } from "@/components/admin/RepeatableOriginBlocks";
import { RepeatableFacts } from "@/components/admin/RepeatableFacts";
import { RepeatableHeroItems } from "@/components/admin/RepeatableHeroItems";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveAboutAction } from "@/app/admin/(dashboard)/about/actions";
import { ABOUT_HERO_MAX_ITEMS, type About } from "@/lib/schemas";

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

      <FieldGroup legend="Hero photography">
        <RepeatableHeroItems
          key={JSON.stringify(about?.heroImages ?? [])}
          initial={about?.heroImages ?? []}
          field="heroImages"
          max={ABOUT_HERO_MAX_ITEMS}
          label="Images"
          allowVideo={false}
          helpText="Two or three documentary stills for the /about hero's photo cluster — desaturated, cool-neutral, same grade as the rest of the site. Fewer than two and the hero renders its typographic plate instead."
        />
      </FieldGroup>

      <div className="border-t border-rule pt-8">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
