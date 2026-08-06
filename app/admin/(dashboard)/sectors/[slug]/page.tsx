import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findSector, listSectors } from "@/lib/repositories/sectors";
import { SectorForm } from "@/components/admin/forms/SectorForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSectorAction } from "../actions";

export const metadata: Metadata = { title: "Edit sector", robots: { index: false } };

export default async function EditSectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [sector, sectors] = await Promise.all([findSector(slug), listSectors()]);
  if (!sector) notFound();

  const order = sectors.findIndex((s) => s.slug === slug);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="type-eyebrow text-green">Sectors</p>
          <h1 className="type-display mt-3 text-h1">{sector.name}</h1>
        </div>
        <DeleteButton
          action={deleteSectorAction.bind(null, sector.slug)}
          confirmMessage={`Delete "${sector.name}"? This can't be undone.`}
        />
      </div>

      <div className="mt-12">
        <SectorForm sector={sector} order={order} />
      </div>
    </div>
  );
}
