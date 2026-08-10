"use client";

import { useActionState, useState } from "react";
import { RepeatableHeroItems } from "@/components/admin/RepeatableHeroItems";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHeroAction } from "@/app/admin/(dashboard)/home/actions";
import type { HomeHero } from "@/lib/schemas";

export function HeroForm({ hero }: { hero: HomeHero }) {
  const [state, formAction] = useActionState(saveHeroAction, null);
  const [dirty, setDirty] = useState(false);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      {/* Keyed on the server-confirmed hero, not on `state` — a save
          triggers Next's automatic refresh of this route's server data, so
          once that lands with the persisted `hero.items`, remounting here
          re-seeds the grid from what's actually in the system rather than
          trusting the client's optimistic copy, and the dirty flag it
          reports resets to false along with it. */}
      <RepeatableHeroItems
        key={JSON.stringify(hero.items)}
        initial={hero.items}
        onDirtyChange={setDirty}
      />

      <div className="border-t border-rule pt-8">
        {dirty ? (
          <SubmitButton>Save changes</SubmitButton>
        ) : (
          <p className="text-caption text-ink-muted">No changes to save.</p>
        )}
      </div>
    </form>
  );
}
