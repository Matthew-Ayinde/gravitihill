import { getDb } from "@/lib/mongodb";
import { insightSchema, type Insight } from "@/lib/schemas";

const COLLECTION = "insights";
type Doc = Insight & { _id: string; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): Insight {
  const { _id, updatedAt, ...rest } = doc;
  return insightSchema.parse(rest);
}

/** Newest first — the order the index and the home "latest three" both want. */
export async function listInsights(): Promise<Insight[]> {
  const docs = await (await collection()).find({}).sort({ publishedAt: -1 }).toArray();
  return docs.map(strip);
}

export async function findInsight(slug: string): Promise<Insight | undefined> {
  const doc = await (await collection()).findOne({ _id: slug });
  return doc ? strip(doc) : undefined;
}

export async function upsertInsight(input: Insight): Promise<void> {
  const data = insightSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.slug },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deleteInsight(slug: string): Promise<void> {
  await (await collection()).deleteOne({ _id: slug });
}
