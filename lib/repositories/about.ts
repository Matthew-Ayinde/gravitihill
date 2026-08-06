import { getDb } from "@/lib/mongodb";
import { aboutSchema, type About } from "@/lib/schemas";

/** Singleton document — the /about positioning, origin story and pull-quote. */

const COLLECTION = "about";
const SINGLETON_ID = "singleton";
type Doc = About & { _id: string; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

export async function getAbout(): Promise<About | undefined> {
  const doc = await (await collection()).findOne({ _id: SINGLETON_ID });
  if (!doc) return undefined;
  const { _id, updatedAt, ...rest } = doc;
  return aboutSchema.parse(rest);
}

export async function saveAbout(input: About): Promise<void> {
  const data = aboutSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: SINGLETON_ID },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}
