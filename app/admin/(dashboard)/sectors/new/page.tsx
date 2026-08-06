import type { Metadata } from "next";
import { listSectors } from "@/lib/repositories/sectors";
import { SectorForm } from "@/components/admin/forms/SectorForm";

export const metadata: Metadata = { title: "New sector", robots: { index: false } };

export default async function NewSectorPage() {
  const sectors = await listSectors();

  return (
    <div>
      <p className="type-eyebrow text-green">Sectors</p>
      <h1 className="type-display mt-3 text-h1">New sector.</h1>
      <div className="mt-12">
        <SectorForm order={sectors.length} />
      </div>
    </div>
  );
}
