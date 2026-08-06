import { getDb } from "@/lib/mongodb";
import { settingsSchema, type Settings } from "@/lib/schemas";

/**
 * Singleton NAP document. Raw CRUD only — lib/settings.ts (note: not this
 * file) is what pages actually import, since it adds the fallback-to-
 * lib/site.ts-constants behaviour for the pre-seed state.
 */

const COLLECTION = "settings";
const SINGLETON_ID = "singleton";
type Doc = Settings & { _id: string; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

export async function getSettings(): Promise<Settings | undefined> {
  const doc = await (await collection()).findOne({ _id: SINGLETON_ID });
  if (!doc) return undefined;
  const { _id, updatedAt, ...rest } = doc;
  return settingsSchema.parse(rest);
}

export async function saveSettings(input: Settings): Promise<void> {
  const data = settingsSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: SINGLETON_ID },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}
