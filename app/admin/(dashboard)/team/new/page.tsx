import type { Metadata } from "next";
import { listTeam } from "@/lib/repositories/team";
import { PersonForm } from "@/components/admin/forms/PersonForm";

export const metadata: Metadata = { title: "New leader", robots: { index: false } };

export default async function NewPersonPage() {
  const team = await listTeam();

  return (
    <div>
      <p className="type-eyebrow text-green">Leadership</p>
      <h1 className="type-display mt-3 text-h1">New leader.</h1>
      <div className="mt-12">
        <PersonForm order={team.length} />
      </div>
    </div>
  );
}
