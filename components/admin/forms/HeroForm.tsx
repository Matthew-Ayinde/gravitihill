"use client";

import { useActionState } from "react";
import { RepeatableHeroItems } from "@/components/admin/RepeatableHeroItems";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHeroAction } from "@/app/admin/(dashboard)/home/actions";
import type { HomeHero } from "@/lib/schemas";

export function HeroForm({ hero }: { hero: HomeHero }) {
  const [state, formAction] = useActionState(saveHeroAction, null);

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <RepeatableHeroItems initial={hero.items} />

      <div className="border-t border-rule pt-8">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
