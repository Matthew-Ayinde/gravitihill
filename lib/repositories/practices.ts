import { getDb } from "@/lib/mongodb";
import { practiceSchema, type Practice } from "@/lib/schemas";

/**
 * Repository for the four practices (services). `_id` is the slug — natural
 * key, no separate index needed. Every write is re-validated against
 * `practiceSchema` so Mongo never holds a shape the pages don't expect.
 */

const COLLECTION = "practices";
type Doc = Practice & { _id: string; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): Practice {
  const { _id, updatedAt, ...rest } = doc;
  return practiceSchema.parse(rest);
}

export async function listPractices(): Promise<Practice[]> {
  const docs = await (await collection()).find({}).sort({ _id: 1 }).toArray();
  return docs.map(strip);
}

export async function findPractice(slug: string): Promise<Practice | undefined> {
  const doc = await (await collection()).findOne({ _id: slug });
  return doc ? strip(doc) : undefined;
}

export async function upsertPractice(input: Practice): Promise<void> {
  const data = practiceSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.slug },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deletePractice(slug: string): Promise<void> {
  await (await collection()).deleteOne({ _id: slug });
}
