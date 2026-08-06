import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findDnaPillar, listDnaPillarsWithSlug } from "@/lib/repositories/dna";
import { PillarForm } from "@/components/admin/forms/PillarForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePillarAction } from "../actions";

export const metadata: Metadata = { title: "Edit pillar", robots: { index: false } };

export default async function EditPillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pillar, pillars] = await Promise.all([findDnaPillar(slug), listDnaPillarsWithSlug()]);
  if (!pillar) notFound();

  const order = pillars.findIndex((p) => p.slug === slug);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Brand DNA</p>
          <h1 className="type-display mt-3 text-h1">{pillar.name}</h1>
        </div>
        <DeleteButton
          action={deletePillarAction.bind(null, slug)}
          confirmMessage={`Delete "${pillar.name}"? This can't be undone.`}
        />
      </div>

      <div className="mt-12">
        <PillarForm pillar={pillar} slug={slug} order={order} />
      </div>
    </div>
  );
}
