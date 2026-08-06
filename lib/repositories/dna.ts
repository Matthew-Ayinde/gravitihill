import { getDb } from "@/lib/mongodb";
import { pillarSchema, type Pillar } from "@/lib/schemas";

/**
 * The four DNA pillars have no natural slug in `pillarSchema`, so the
 * repository derives one from `name` and uses it as `_id` — same pattern as
 * practices/sectors/team, and critically makes `upsertDnaPillar` idempotent
 * by name (re-running the seed script never duplicates a pillar).
 */

const COLLECTION = "dnaPillars";
type Doc = Pillar & { _id: string; order: number; updatedAt: string };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): Pillar {
  const { _id, order, updatedAt, ...rest } = doc;
  return pillarSchema.parse(rest);
}

export async function listDnaPillars(): Promise<Pillar[]> {
  const docs = await (await collection()).find({}).sort({ order: 1 }).toArray();
  return docs.map(strip);
}

/** Public list + the slug each edit route needs. */
export async function listDnaPillarsWithSlug(): Promise<(Pillar & { slug: string })[]> {
  const docs = await (await collection()).find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({ ...strip(doc), slug: doc._id }));
}

export async function findDnaPillar(slug: string): Promise<Pillar | undefined> {
  const doc = await (await collection()).findOne({ _id: slug });
  return doc ? strip(doc) : undefined;
}

/** Upserts by the slug derived from `input.name` — renaming a pillar creates a new record. */
export async function upsertDnaPillar(input: Pillar, order: number): Promise<void> {
  const data = pillarSchema.parse(input);
  const _id = slugify(data.name);
  await (await collection()).replaceOne(
    { _id },
    { ...data, order, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deleteDnaPillar(slug: string): Promise<void> {
  await (await collection()).deleteOne({ _id: slug });
}
