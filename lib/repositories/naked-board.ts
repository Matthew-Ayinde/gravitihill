import { getDb } from "@/lib/mongodb";
import { nakedBoardSchema, type NakedBoard } from "@/lib/schemas";

/** Singleton document — The Naked Board has exactly one record on the site. */

const COLLECTION = "nakedBoard";
const SINGLETON_ID = "singleton";
type Doc = NakedBoard & { _id: string; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

export async function getNakedBoard(): Promise<NakedBoard | undefined> {
  const doc = await (await collection()).findOne({ _id: SINGLETON_ID });
  if (!doc) return undefined;
  const { _id, updatedAt, ...rest } = doc;
  return nakedBoardSchema.parse(rest);
}

export async function saveNakedBoard(input: NakedBoard): Promise<void> {
  const data = nakedBoardSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: SINGLETON_ID },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}
