import type { Metadata } from "next";
import { listDnaPillars } from "@/lib/repositories/dna";
import { PillarForm } from "@/components/admin/forms/PillarForm";

export const metadata: Metadata = { title: "New pillar", robots: { index: false } };

export default async function NewPillarPage() {
  const pillars = await listDnaPillars();

  return (
    <div>
      <p className="type-eyebrow text-green">Brand DNA</p>
      <h1 className="type-display mt-3 text-h1">New pillar.</h1>
      <div className="mt-12">
        <PillarForm order={pillars.length} />
      </div>
    </div>
  );
}
