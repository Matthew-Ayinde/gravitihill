import { getDb } from "@/lib/mongodb";
import { sectorSchema, type Sector } from "@/lib/schemas";

/**
 * Repository for the three sectors. Order is load-bearing — it drives the
 * Consumer → B2B → Technology sequence in the signature pinned panel — so
 * each document carries an `order` field and reads sort by it, not by slug.
 */

const COLLECTION = "sectors";
type Doc = Sector & { _id: string; order: number; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): Sector {
  const { _id, order, updatedAt, ...rest } = doc;
  return sectorSchema.parse(rest);
}

export async function listSectors(): Promise<Sector[]> {
  const docs = await (await collection()).find({}).sort({ order: 1 }).toArray();
  return docs.map(strip);
}

export async function findSector(slug: string): Promise<Sector | undefined> {
  const doc = await (await collection()).findOne({ _id: slug });
  return doc ? strip(doc) : undefined;
}

export async function upsertSector(input: Sector, order: number): Promise<void> {
  const data = sectorSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.slug },
    { ...data, order, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deleteSector(slug: string): Promise<void> {
  await (await collection()).deleteOne({ _id: slug });
}
