import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPerson, listTeam } from "@/lib/repositories/team";
import { PersonForm } from "@/components/admin/forms/PersonForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SavedToast } from "@/components/admin/SavedToast";
import { deletePersonAction } from "../actions";

export const metadata: Metadata = { title: "Edit leader", robots: { index: false } };

export default async function EditPersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const [person, team, { saved }] = await Promise.all([findPerson(slug), listTeam(), searchParams]);
  if (!person) notFound();

  const order = team.findIndex((p) => p.slug === slug);

  return (
    <div>
      <SavedToast saved={saved === "1"} />
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Leadership</p>
          <h1 className="type-display mt-3 text-h1">{person.name}</h1>
        </div>
        <DeleteButton
          action={deletePersonAction.bind(null, person.slug)}
          confirmMessage={`Delete "${person.name}"? This can't be undone.`}
        />
      </div>

      <div className="mt-12">
        <PersonForm person={person} order={order} />
      </div>
    </div>
  );
}
