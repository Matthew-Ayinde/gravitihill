import type { Metadata } from "next";
import { listSectors } from "@/lib/repositories/sectors";
import { PracticeForm } from "@/components/admin/forms/PracticeForm";

export const metadata: Metadata = { title: "New service", robots: { index: false } };

export default async function NewPracticePage() {
  const sectors = await listSectors();

  return (
    <div>
      <p className="type-eyebrow text-green">Services</p>
      <h1 className="type-display mt-3 text-h1">New practice.</h1>
      <div className="mt-12">
        <PracticeForm sectorOptions={sectors} />
      </div>
    </div>
  );
}
