import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findPractice } from "@/lib/repositories/practices";
import { listSectors } from "@/lib/repositories/sectors";
import { PracticeForm } from "@/components/admin/forms/PracticeForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePracticeAction } from "../actions";

export const metadata: Metadata = { title: "Edit service", robots: { index: false } };

export default async function EditPracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [practice, sectors] = await Promise.all([findPractice(slug), listSectors()]);
  if (!practice) notFound();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Services</p>
          <h1 className="type-display mt-3 text-h1">{practice.name}</h1>
        </div>
        <DeleteButton
          action={deletePracticeAction.bind(null, practice.slug)}
          confirmMessage={`Delete "${practice.name}"? This can't be undone.`}
        />
      </div>

      <div className="mt-12">
        <PracticeForm practice={practice} sectorOptions={sectors} />
      </div>
    </div>
  );
}
